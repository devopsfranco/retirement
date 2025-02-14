# Retirement Coin Project

Welcome to the Retirement Coin Project repository.

## Staking Program Overview

The Retirement Coin Project is built on Solana, utilizing the Anchor framework for high-performance, secure, and decentralized staking. Key features include:
- **Anchor Framework**: Provides seamless integration with Solana for programmatic staking and governance.
- **Dynamic Rewards**: Rewards are calculated based on time-weighted balances, ensuring fairness and transparency.
- **Manual Reward Claims**: Users can claim rewards at their convenience, offering flexibility and control.
- **SPL Token Standard**: Fully compliant with Solana's SPL token standard for efficient token management.
- **Modernized Backend**: Transitioned from legacy PHP/Solidity to a robust Solana/Anchor-based architecture.
- **Next.js API Routes**: Simplified backend interactions using modern API routing.

## Usage Instructions

### Staking Tokens
1. Use the `/api/deposit` endpoint to stake your SPL tokens into the pool.
2. Ensure your wallet is connected and has sufficient SPL tokens for staking.

### Withdrawing Tokens
1. Use the `/api/withdraw` endpoint to retrieve your staked tokens from the pool.
2. Verify that your staked balance meets the withdrawal requirements.

### Claiming Rewards
1. Call the `/api/claim_rewards` endpoint to collect your staking rewards.
2. Rewards are dynamically calculated based on staking duration, balance, and applicable bonuses.

### NFT Integration
1. Stake eligible NFTs to unlock additional staking bonuses (e.g., yield multipliers).
2. Use the `/api/nft_stake` endpoint to associate your NFT with your staking account.
3. View your NFT-based rewards in the dashboard.

## API Endpoints

### Available Endpoints
- **POST /api/deposit**: Stake SPL tokens.
- **POST /api/withdraw**: Withdraw staked tokens.
- **POST /api/claim_rewards**: Claim staking rewards.
- **POST /api/nft_stake**: Stake NFTs for additional bonuses.
- **GET /api/get_rewards**: Retrieve reward details.

## RetirementCoin Ecosystem Rules

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

### Governance
- NFT voting power decays with withdrawal activity.
- Emergency pause via multisig within 24h.
- Protocol fee votes (0.5%-2% range).
- Yield reserve audits every 90 epochs.

## Feedback & Issues

We value your feedback! If you encounter any bugs, have feature requests, or want to share your thoughts, please visit our [GitHub Issues Page](https://github.com/devopsfranco/retirement/issues) to submit your feedback or report issues.

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