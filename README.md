# Retirement Coin Project

Welcome to the Retirement Coin Project repository.

## Staking Program Overview

The Retirement Coin Project now runs on Solana, leveraging the Anchor framework for high-performance and secure staking. Key features include:
- **Anchor Framework**: Built using Anchor for seamless Solana integration.
- **Dynamic Rewards**: Rewards are distributed based on time-weighted balances for fairness.
- **Manual Reward Claims**: Users claim rewards manually, ensuring flexibility and security.
- **SPL Token Integration**: Fully integrated with Solana's SPL token standard for token transfers.

## Usage Instructions

### Staking Tokens
1. Use the `deposit` function to stake your tokens into the staking pool.
2. Ensure you have sufficient SPL tokens in your wallet.

### Withdrawing Tokens
1. Use the `withdraw` function to withdraw your staked tokens.
2. Ensure you have sufficient staked tokens before withdrawing.

### Claiming Rewards
1. Use the `claim_rewards` function to claim your accumulated rewards.
2. Rewards are calculated dynamically based on your staking duration and balance.

## Frontend Integration

The frontend interacts with the staking program using `@solana/web3.js` and the Anchor client. This integration provides:
- **State Management**: Fetches and updates staking state using Solana's RPC and Anchor's APIs.
- **Actions**: Functions for depositing, withdrawing, and claiming rewards.
- **Wallet Integration**: Built with `@solana/wallet-adapter-react` for seamless wallet connectivity.

### Example Usage
```tsx
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program } from '@project-serum/anchor';

const StakingComponent = () => {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program(idl, programId, provider);

  const depositTokens = async (amount) => {
    await program.rpc.deposit(new BN(amount), {
      accounts: {
        staker: wallet.publicKey,
        stakingAccount: stakingAccountPublicKey,
        stakingPool: stakingPoolPublicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });
  };

  return (
    <div>
      <h1>Staking Dashboard</h1>
      <button onClick={() => depositTokens(100)}>Deposit 100 Tokens</button>
    </div>
  );
};
```

## Deployment Instructions

### Deploying the Staking Program
1. Install the Anchor CLI:
   ```bash
   cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
   ```
2. Build the program:
   ```bash
   anchor build
   ```
3. Deploy the program to Solana:
   ```bash
   anchor deploy
   ```
4. Verify the deployment by checking the program ID in the `target/idl/` directory.

## Additional Resources

For detailed design decisions, security considerations, and compliance standards, refer to the [ADR Document](./docs/ADR-Staking.md).