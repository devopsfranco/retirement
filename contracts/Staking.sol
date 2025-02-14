pragma solidity ^0.8.25;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

/**
 * @title Staking Contract
 * @dev Upgradable ERC-20 staking contract with dynamic reward distribution.
 */
contract Staking is Initializable, AccessControlUpgradeable, ReentrancyGuardUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Staking token
    IERC20Upgradeable public stakingToken;

    // Reward token
    IERC20Upgradeable public rewardToken;

    // Reward rate per second
    uint256 public rewardRate;

    // Total staked tokens
    uint256 public totalStaked;

    // Packed storage for user staking data
    struct Staker {
        uint256 balance; // Staked balance
        uint256 rewardDebt; // Reward debt
        uint256 lastUpdated; // Last update timestamp
    }

    mapping(address => Staker) private stakers;

    // Accumulated rewards per token
    uint256 private accRewardPerToken;

    // Last reward update timestamp
    uint256 private lastRewardTime;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);

    /**
     * @dev Initialize the staking contract.
     * @param _stakingToken Address of the staking token.
     * @param _rewardToken Address of the reward token.
     * @param _rewardRate Reward rate per second.
     */
    function initialize(
        IERC20Upgradeable _stakingToken,
        IERC20Upgradeable _rewardToken,
        uint256 _rewardRate
    ) external initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();

        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
        rewardRate = _rewardRate;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);

        lastRewardTime = block.timestamp;
    }

    /**
     * @dev Stake tokens into the contract.
     * @param _amount Amount of tokens to stake.
     */
    function stake(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Cannot stake zero tokens");

        _updateRewards();

        Staker storage staker = stakers[msg.sender];
        if (staker.balance > 0) {
            uint256 pendingReward = (staker.balance * accRewardPerToken) / 1e18 - staker.rewardDebt;
            if (pendingReward > 0) {
                rewardToken.safeTransfer(msg.sender, pendingReward);
                emit RewardClaimed(msg.sender, pendingReward);
            }
        }

        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        staker.balance += _amount;
        staker.rewardDebt = (staker.balance * accRewardPerToken) / 1e18;

        totalStaked += _amount;

        emit Staked(msg.sender, _amount);
    }

    /**
     * @dev Withdraw staked tokens.
     * @param _amount Amount of tokens to withdraw.
     */
    function withdraw(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Cannot withdraw zero tokens");

        Staker storage staker = stakers[msg.sender];
        require(staker.balance >= _amount, "Insufficient staked balance");

        _updateRewards();

        uint256 pendingReward = (staker.balance * accRewardPerToken) / 1e18 - staker.rewardDebt;
        if (pendingReward > 0) {
            rewardToken.safeTransfer(msg.sender, pendingReward);
            emit RewardClaimed(msg.sender, pendingReward);
        }

        staker.balance -= _amount;
        staker.rewardDebt = (staker.balance * accRewardPerToken) / 1e18;

        stakingToken.safeTransfer(msg.sender, _amount);

        totalStaked -= _amount;

        emit Withdrawn(msg.sender, _amount);
    }

    /**
     * @dev Claim pending rewards.
     */
    function claimRewards() external nonReentrant {
        _updateRewards();

        Staker storage staker = stakers[msg.sender];
        uint256 pendingReward = (staker.balance * accRewardPerToken) / 1e18 - staker.rewardDebt;
        require(pendingReward > 0, "No rewards to claim");

        staker.rewardDebt = (staker.balance * accRewardPerToken) / 1e18;

        rewardToken.safeTransfer(msg.sender, pendingReward);

        emit RewardClaimed(msg.sender, pendingReward);
    }

    /**
     * @dev Update reward variables.
     */
    function _updateRewards() internal {
        if (block.timestamp > lastRewardTime && totalStaked > 0) {
            uint256 timeElapsed = block.timestamp - lastRewardTime;
            uint256 reward = timeElapsed * rewardRate;
            accRewardPerToken += (reward * 1e18) / totalStaked;
        }
        lastRewardTime = block.timestamp;
    }

    /**
     * @dev Set a new reward rate.
     * @param _rewardRate New reward rate per second.
     */
    function setRewardRate(uint256 _rewardRate) external onlyRole(ADMIN_ROLE) {
        _updateRewards();
        rewardRate = _rewardRate;
    }

    /**
     * @dev Emergency withdraw all staked tokens (no rewards).
     */
    function emergencyWithdraw() external nonReentrant {
        Staker storage staker = stakers[msg.sender];
        uint256 stakedAmount = staker.balance;

        require(stakedAmount > 0, "No staked tokens to withdraw");

        staker.balance = 0;
        staker.rewardDebt = 0;

        stakingToken.safeTransfer(msg.sender, stakedAmount);

        totalStaked -= stakedAmount;

        emit Withdrawn(msg.sender, stakedAmount);
    }
}
