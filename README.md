# Retirement Coin Project

Welcome to the Retirement Coin Project repository.

## Staking Program Overview

The Retirement Coin Project now runs on Solana, leveraging the Anchor framework for high-performance and secure staking. Key features include:
- **Anchor Framework**: Built using Anchor for seamless Solana integration.
- **Dynamic Rewards**: Rewards are distributed based on time-weighted balances for fairness.
- **Manual Reward Claims**: Users claim rewards manually, ensuring flexibility and security.
- **SPL Token Integration**: Fully integrated with Solana's SPL token standard for token transfers.
- **Backend Migration**: The backend has been migrated from PHP and Solidity to Solana using the Anchor framework.

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
- **Modern Libraries**: Utilizes modern Solana libraries for enhanced performance and security.

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

> Note: Ensure that your Solana CLI is configured with the correct network and wallet.

## Additional Resources

For detailed design decisions, security considerations, and compliance standards, refer to the [ADR Document](./docs/ADR-Staking.md).

---

## RetirementCoin Ecosystem

### Core Addresses
- **Main Program Address**: `HLRGoPcK1n4fmkowVyBNkVHRoiiCUL2qyneNqTUNpump`
- **NFT Program Address**: `NFT_PROGRAM_ADDRESS_HERE`

### Token Economics
#### Retirement Token
- SPL-token mint with freeze authority disabled.
- 5% annual staking yield capped by reserve ratio.
- Time-locked withdrawals via Solana Epoch tracking.
- [Gate.io](http://Gate.io) integration with verified liquidity pools.
- Phantom Wallet session keys for recurring contributions.

#### Wojak NFTs
- Metaplex-compliant minting with URI freeze.
- NFT traits influence staking yield bonuses (max +15%).
- On-chain age verification via Oracle (e.g., Civic).
- Burn-and-mint upgrade mechanics for avatars.
- Royalty-free trading between verified retirement accounts.

### Security
#### Access Control
- Multisig treasury (3/5) for yield reserves.
- PDA-derived retirement accounts with stored bumps.
- Withdrawal cooldown periods (72h for >$10k).
- NFT metadata signed by backend oracle.

#### Compliance
- IRS Form 1099-R event logging for withdrawals.
- OFAC screening on NFT marketplace deposits.
- Age-gated contributions via KYC oracle.
- Anti-sybil checks for bonus eligibility.

### User Workflows
#### Onboarding
- Phantom Wallet SSO with session key delegation.
- [Gate.io](http://Gate.io) → SOL → $RETIREMENT swap helper.
- Wojak Customizer mint cap: 1 NFT/wallet.
- Auto-staking of initial deposit (>$500).

#### Retirement Management
- 5-year vesting schedule visualization tools.
- NFT avatar as dashboard access key.
- Hardship withdrawal petitions via governance NFT.
- In-kind distributions to verified IRAs.

### NFT Subsystem
#### Customizer Rules
- SVG-based traits stored on Arweave.
- Client-side rendering with WASM optimizations.
- Trait rarity enforced via program rules.
- Legacy avatar migration through burn proofs.

#### Integration
- NFT yields compound with token staking.
- Avatar achievements unlock contribution limits.
- Dead man's switch beneficiary designation.
- ERC-6551-like token-bound accounts for heirs.

### Frontend Enhancements
- Wallet-age weighted portfolio display.
- NFT gallery with retirement countdown clock.
- SEC risk disclosures on all action modals.
- Gas sponsorship for compliance-approved actions.

### Governance
- NFT voting power decays with withdrawal activity.
- Emergency pause via multisig within 24h.
- Protocol fee votes (0.5%-2% range).
- Yield reserve audits every 90 epochs.

## RetirementCoin Ecosystem

### Core Addresses
- **Main Program Address**: `HLRGoPcK1n4fmkowVyBNkVHRoiiCUL2qyneNqTUNpump`
- **NFT Program Address**: `NFT_PROGRAM_ADDRESS_HERE`

### Token Economics
#### Retirement Token
- SPL-token mint with freeze authority disabled.
- 5% annual staking yield capped by reserve ratio.
- Time-locked withdrawals via Solana Epoch tracking.
- [Gate.io](http://Gate.io) integration with verified liquidity pools.
- Phantom Wallet session keys for recurring contributions.

#### Wojak NFTs
- Metaplex-compliant minting with URI freeze.
- NFT traits influence staking yield bonuses (max +15%).
- On-chain age verification via Oracle (e.g., Civic).
- Burn-and-mint upgrade mechanics for avatars.
- Royalty-free trading between verified retirement accounts.

### Security
#### Access Control
- Multisig treasury (3/5) for yield reserves.
- PDA-derived retirement accounts with stored bumps.
- Withdrawal cooldown periods (72h for >$10k).
- NFT metadata signed by backend oracle.

#### Compliance
- IRS Form 1099-R event logging for withdrawals.
- OFAC screening on NFT marketplace deposits.
- Age-gated contributions via KYC oracle.
- Anti-sybil checks for bonus eligibility.

### User Workflows
#### Onboarding
- Phantom Wallet SSO with session key delegation.
- [Gate.io](http://Gate.io) → SOL → $RETIREMENT swap helper.
- Wojak Customizer mint cap: 1 NFT/wallet.
- Auto-staking of initial deposit (>$500).

#### Retirement Management
- 5-year vesting schedule visualization tools.
- NFT avatar as dashboard access key.
- Hardship withdrawal petitions via governance NFT.
- In-kind distributions to verified IRAs.

### NFT Subsystem
#### Customizer Rules
- SVG-based traits stored on Arweave.
- Client-side rendering with WASM optimizations.
- Trait rarity enforced via program rules.
- Legacy avatar migration through burn proofs.

#### Integration
- NFT yields compound with token staking.
- Avatar achievements unlock contribution limits.
- Dead man's switch beneficiary designation.
- ERC-6551-like token-bound accounts for heirs.

### Frontend Enhancements
- Wallet-age weighted portfolio display.
- NFT gallery with retirement countdown clock.
- SEC risk disclosures on all action modals.
- Gas sponsorship for compliance-approved actions.

### Governance
- NFT voting power decays with withdrawal activity.
- Emergency pause via multisig within 24h.
- Protocol fee votes (0.5%-2% range).
- Yield reserve audits every 90 epochs.