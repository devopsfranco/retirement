# Retirement Coin Project

Welcome to the Retirement Coin Project repository.

## Staking Contracts Overview

The Retirement Coin Project includes an upgradable ERC-20 staking contract designed for secure and efficient staking with dynamic reward distribution. Key features include:
- **Upgradeable Design**: Built using the Transparent Proxy pattern for future-proofing.
- **Dynamic Rewards**: Rewards are distributed based on time-weighted balances for fairness.
- **Pull-over-Push Pattern**: Users claim rewards manually, reducing gas costs and reentrancy risks.
- **Security Best Practices**: Adheres to OWASP Top 10 and Consensys Smart Contract Best Practices.

## Usage Instructions

### Staking Tokens
1. Approve the staking contract to spend your tokens.
2. Call the `stake` function with the amount of tokens you want to stake.

### Withdrawing Tokens
1. Call the `withdraw` function with the amount of tokens you want to withdraw.
2. Ensure you have sufficient staked tokens before withdrawing.

### Claiming Rewards
1. Call the `claimRewards` function to claim your accumulated rewards.
2. Rewards are calculated dynamically based on your staking duration and balance.

## Frontend Integration

The frontend interacts with the staking contract using the `useStaking` React hook. This hook provides:
- **State Management**: Automatically fetches and updates staking state using SWR.
- **Actions**: Functions for staking, withdrawing, and claiming rewards.
- **Type Safety**: Built with TypeScript and TypeChain for robust contract interaction.

### Example Usage
```tsx
import { useStaking } from './src/hooks/useStaking';

const StakingComponent = () => {
  const { stakingState, stakeTokens, withdrawTokens, claimRewards } = useStaking();

  return (
    <div>
      <h1>Staking Dashboard</h1>
      <p>Staked Balance: {stakingState?.balance}</p>
      <button onClick={() => stakeTokens('100')}>Stake 100 Tokens</button>
      <button onClick={() => withdrawTokens('50')}>Withdraw 50 Tokens</button>
      <button onClick={claimRewards}>Claim Rewards</button>
    </div>
  );
};
```

## Additional Resources

For detailed design decisions, security considerations, and compliance standards, refer to the [ADR Document](./docs/ADR-Staking.md).