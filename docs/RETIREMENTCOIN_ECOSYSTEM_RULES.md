# RetirementCoin Ecosystem Rules

## Description
Unified ruleset for retirement-focused DeFi protocol with integrated NFT identity system.

---

## Core Addresses
- **Main Program Address**: `HLRGoPcK1n4fmkowVyBNkVHRoiiCUL2qyneNqTUNpump`
- **NFT Program Address**: `9u48hDfYSQsEuV9mdKaP31dF1CtqSuxL1mqeBY6Mz1CP`

---

## Token Economics

### Retirement Token Rules
1. SPL-token mint with freeze authority disabled (verified on-chain).
2. 5% annual staking yield capped by reserve ratio.
3. Time-locked withdrawals via Solana Epoch tracking (72-hour minimum).
4. [Gate.io](http://Gate.io) integration with verified liquidity pools.
5. Phantom Wallet session keys for recurring contributions (auto-renew enabled).

### Wojak NFTs Rules
1. Metaplex-compliant minting with URI freeze.
2. NFT traits influence staking yield bonuses (max +15%).
3. On-chain age verification via Oracle (e.g., Civic) with fallback to manual KYC.
4. Burn-and-mint upgrade mechanics for avatars (supports ERC-6551-like token-bound accounts).
5. Royalty-free trading between verified retirement accounts.

---

## Security

### Access Control Rules
1. Multisig treasury (3/5) for yield reserves (auto-audit every 90 epochs).
2. PDA-derived retirement accounts with stored bumps (securely hashed).
3. Withdrawal cooldown periods (72h for >$10k).
4. NFT metadata signed by backend oracle (verified via Solana's SPL metadata program).

### Compliance Rules
1. IRS Form 1099-R event logging for withdrawals.
2. OFAC screening on NFT marketplace deposits.
3. Age-gated contributions via KYC oracle.
4. Anti-sybil checks for bonus eligibility.

---

## User Workflows

### Onboarding Rules
1. Phantom Wallet SSO with session key delegation (supports wallet age verification).
2. [Gate.io](http://Gate.io) → SOL → $RETIREMENT swap helper.
3. Wojak Customizer mint cap: 1 NFT/wallet.
4. Auto-staking of initial deposit (>$500).

### Retirement Management Rules
1. 5-year vesting schedule visualization tools.
2. NFT avatar as dashboard access key.
3. Hardship withdrawal petitions via governance NFT.
4. In-kind distributions to verified IRAs (auto-conversion to SPL tokens supported).

---

## NFT Subsystem

### Customizer Rules
1. SVG-based traits stored on Arweave (with IPFS fallback).
2. Client-side rendering with WASM optimizations.
3. Trait rarity enforced via program rules.
4. Legacy avatar migration through burn proofs.

### Integration Rules
1. NFT yields compound with token staking.
2. Avatar achievements unlock contribution limits.
3. Dead man's switch beneficiary designation.
4. ERC-6551-like token-bound accounts for heirs (supports multi-signature inheritance).

---

## Frontend Guidelines
1. Wallet-age weighted portfolio display.
2. NFT gallery with retirement countdown clock.
3. SEC risk disclosures on all action modals.
4. Gas sponsorship for compliance-approved actions (limited to 0.01 SOL per transaction).

---

## Governance Features
1. NFT voting power decays with withdrawal activity.
2. Emergency pause via multisig within 24h (requires 4/5 signatures for activation).
3. Protocol fee votes (0.5%-2% range).
4. Yield reserve audits every 90 epochs.