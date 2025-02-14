import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Staking Contract", function () {
  let staking: Contract;
  let stakingToken: Contract;
  let rewardToken: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const initialSupply = ethers.utils.parseEther("1000000");
  const rewardRate = ethers.utils.parseEther("1"); // 1 token per second

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20Mock");
    stakingToken = await Token.deploy("Staking Token", "STK", initialSupply);
    rewardToken = await Token.deploy("Reward Token", "RWD", initialSupply);

    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy();
    await staking.initialize(stakingToken.address, rewardToken.address, rewardRate);

    // Grant staking contract allowance to transfer reward tokens
    await rewardToken.connect(owner).approve(staking.address, initialSupply);
  });

  describe("Stake", function () {
    it("should allow users to stake tokens", async function () {
      const stakeAmount = ethers.utils.parseEther("100");

      await stakingToken.connect(user1).approve(staking.address, stakeAmount);
      await staking.connect(user1).stake(stakeAmount);

      const stakedBalance = await staking.stakers(user1.address);
      expect(stakedBalance.balance).to.equal(stakeAmount);
    });

    it("should revert if staking zero tokens", async function () {
      await expect(staking.connect(user1).stake(0)).to.be.revertedWith("Cannot stake zero tokens");
    });
  });

  describe("Withdraw", function () {
    it("should allow users to withdraw staked tokens", async function () {
      const stakeAmount = ethers.utils.parseEther("100");

      await stakingToken.connect(user1).approve(staking.address, stakeAmount);
      await staking.connect(user1).stake(stakeAmount);

      await staking.connect(user1).withdraw(stakeAmount);

      const stakedBalance = await staking.stakers(user1.address);
      expect(stakedBalance.balance).to.equal(0);
    });

    it("should revert if withdrawing more than staked", async function () {
      const stakeAmount = ethers.utils.parseEther("100");

      await stakingToken.connect(user1).approve(staking.address, stakeAmount);
      await staking.connect(user1).stake(stakeAmount);

      await expect(staking.connect(user1).withdraw(stakeAmount.add(1))).to.be.revertedWith("Insufficient staked balance");
    });
  });

  describe("Claim Rewards", function () {
    it("should allow users to claim rewards", async function () {
      const stakeAmount = ethers.utils.parseEther("100");

      await stakingToken.connect(user1).approve(staking.address, stakeAmount);
      await staking.connect(user1).stake(stakeAmount);

      // Simulate time passing
      await ethers.provider.send("evm_increaseTime", [10]); // 10 seconds
      await ethers.provider.send("evm_mine", []);

      const pendingRewards = await staking.connect(user1).callStatic.claimRewards();
      expect(pendingRewards).to.equal(ethers.utils.parseEther("10"));

      await staking.connect(user1).claimRewards();

      const rewardBalance = await rewardToken.balanceOf(user1.address);
      expect(rewardBalance).to.equal(ethers.utils.parseEther("10"));
    });

    it("should revert if no rewards to claim", async function () {
      await expect(staking.connect(user1).claimRewards()).to.be.revertedWith("No rewards to claim");
    });
  });

  describe("Emergency Withdraw", function () {
    it("should allow users to withdraw staked tokens without rewards", async function () {
      const stakeAmount = ethers.utils.parseEther("100");

      await stakingToken.connect(user1).approve(staking.address, stakeAmount);
      await staking.connect(user1).stake(stakeAmount);

      await staking.connect(user1).emergencyWithdraw();

      const stakedBalance = await staking.stakers(user1.address);
      expect(stakedBalance.balance).to.equal(0);

      const stakingTokenBalance = await stakingToken.balanceOf(user1.address);
      expect(stakingTokenBalance).to.equal(stakeAmount);
    });

    it("should revert if no staked tokens", async function () {
      await expect(staking.connect(user1).emergencyWithdraw()).to.be.revertedWith("No staked tokens to withdraw");
    });
  });

  describe("Admin Functions", function () {
    it("should allow admin to set reward rate", async function () {
      const newRewardRate = ethers.utils.parseEther("2");
      await staking.connect(owner).setRewardRate(newRewardRate);

      const updatedRewardRate = await staking.rewardRate();
      expect(updatedRewardRate).to.equal(newRewardRate);
    });

    it("should revert if non-admin tries to set reward rate", async function () {
      const newRewardRate = ethers.utils.parseEther("2");
      await expect(staking.connect(user1).setRewardRate(newRewardRate)).to.be.revertedWith(
        "AccessControl: account"
      );
    });
  });

  describe("Gas Snapshot", function () {
    it("should record gas usage for staking", async function () {
      const stakeAmount = ethers.utils.parseEther("100");

      await stakingToken.connect(user1).approve(staking.address, stakeAmount);
      const tx = await staking.connect(user1).stake(stakeAmount);

      const receipt = await tx.wait();
      console.log("Gas used for staking:", receipt.gasUsed.toString());
    });
  });
});
