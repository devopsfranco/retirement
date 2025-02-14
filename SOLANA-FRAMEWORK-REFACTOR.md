# Solana Framework Refactor Proposal

## Introduction

This document outlines a proposed refactor for the application to adopt a modular architecture that is web3 and Solana-friendly. The goal is to enhance scalability, maintainability, and extensibility while integrating features like staking and governance. The refactor will leverage modern frameworks and libraries to ensure a robust development experience.

---

## Rationale for Using Next.js with TypeScript

- **Type Safety**: TypeScript provides static typing, reducing runtime errors and improving code quality.
- **Server-Side Rendering (SSR)**: Next.js supports SSR, which is beneficial for SEO and performance.
- **File-Based Routing**: Simplifies navigation and improves developer productivity.
- **Rich Ecosystem**: Next.js integrates seamlessly with React and has a vast plugin ecosystem.
- **Scalability**: Modular architecture in Next.js aligns with the goal of decoupling business logic.

---

## Proposed Architecture

### New File Structure

The refactor will introduce a modular file structure to separate concerns and improve maintainability:

---

## Anchor-Based Staking Program

### Overview
The staking program has been implemented using the Anchor framework to leverage Solana's high-performance blockchain. It provides the following functionalities:
- **Deposit**: Users can deposit tokens into the staking pool.
- **Withdraw**: Users can withdraw their staked tokens.
- **Claim Rewards**: Users can claim rewards based on a time-weighted balance.

### Key Features
1. **Dynamic Reward Distribution**: Rewards are calculated based on the staker's balance and the time elapsed since the last deposit.
2. **Role-Based Access Control**: Only the staker can perform actions on their account.
3. **SPL Token Integration**: The program uses SPL Token instructions for token transfers.

---

```
src/
├── components/          # Reusable UI components
├── modules/             # Feature-specific modules
│   ├── staking/         # Staking functionality
│   ├── governance/      # Governance functionality
├── pages/               # Next.js pages
├── services/            # Web3 utilities and API integrations
│   ├── web3/            # Solana-specific utilities

---

## Integration with Frontend

### Wallet Adapter Configuration
To integrate wallets like Phantom or Solflare, configure `@solana/wallet-adapter-react` as follows:
1. Install the required dependencies:
   ```bash
   npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
   ```
2. Wrap your application with the `WalletProvider` and `WalletModalProvider` components:
   ```tsx
   import { WalletProvider, WalletModalProvider } from '@solana/wallet-adapter-react-ui';

   <WalletProvider wallets={wallets}>
       <WalletModalProvider>
           <App />
       </WalletModalProvider>
   </WalletProvider>
   ```

### Frontend Integration
Use `@solana/web3.js` and the Anchor client to interact with the staking program:
1. Initialize the connection and wallet:
   ```tsx
   import { Connection, PublicKey } from '@solana/web3.js';
   import { AnchorProvider, Program } from '@project-serum/anchor';

   const connection = new Connection(clusterApiUrl('mainnet-beta'));
   const provider = new AnchorProvider(connection, wallet, {});
   const program = new Program(idl, programId, provider);
   ```
2. Call program methods (e.g., deposit):
   ```tsx
   await program.rpc.deposit(new BN(amount), {
       accounts: {
           staker: wallet.publicKey,
           stakingAccount: stakingAccountPublicKey,
           stakingPool: stakingPoolPublicKey,
           tokenProgram: TOKEN_PROGRAM_ID,
       },
   });
   ```

---
│   ├── api/             # Backend API calls
├── hooks/               # Custom React hooks
├── utils/               # Helper functions

---

## Testing Guidelines

### Using Anchor's Testing Suite
1. Write tests in the `tests/` directory of your Anchor project.
2. Use Mocha and Chai for assertions:
   ```javascript
   const { expect } = require('chai');

   it('Deposits tokens into the staking pool', async () => {
       const tx = await program.rpc.deposit(new BN(100), {
           accounts: {
               staker: provider.wallet.publicKey,
               stakingAccount,
               stakingPool,
               tokenProgram: TOKEN_PROGRAM_ID,
           },
       });
       expect(tx).to.be.ok;
   });
   ```
3. Run tests with the Anchor CLI:
   ```bash
   anchor test
   ```

---
├── styles/              # Global and module-specific styles

---

## Deployment Steps

### Using Anchor CLI
1. Build the program:
   ```bash
   anchor build
   ```
2. Deploy the program to the Solana blockchain:
   ```bash
   anchor deploy
   ```
3. Verify the deployment by checking the program ID in the `target/idl/` directory.

---
```

### New Modules

1. **Staking Module (`/src/modules/staking`)**:
   - Handles staking logic and UI.
   - Integrates with Solana smart contracts for staking operations.

2. **Governance Module (`/src/modules/governance`)**:
   - Manages governance proposals and voting.
   - Utilizes wallet integration for user authentication.

3. **Web3 Utilities (`/src/services/web3`)**:
   - Encapsulates Solana-specific logic using `@solana/web3.js`.
   - Provides helper functions for wallet interactions, transaction signing, and blockchain queries.

---

## Integration Points with Solana Libraries

The refactor will leverage the following Solana libraries:

1. **`@solana/web3.js`**:
   - Core library for interacting with the Solana blockchain.
   - Used for creating transactions, querying accounts, and interacting with smart contracts.

2. **`@solana/wallet-adapter-react`**:
   - Simplifies wallet integration.
   - Provides hooks and components for connecting wallets like Phantom and Solflare.

3. **`@solana/wallet-adapter-react-ui`**:
   - Prebuilt UI components for wallet interactions.

---

## Phased Refactor Plan

### Phase 1: Setup and Initial Refactor
- Migrate the project to TypeScript.
- Restructure the file system to align with the proposed architecture.
- Integrate `@solana/web3.js` and `@solana/wallet-adapter-react`.

### Phase 2: Implement Core Modules
- Develop the `staking` and `governance` modules.
- Create reusable components for wallet interactions.

### Phase 3: Incremental Testing
- Write unit tests for new modules using Jest.
- Perform integration testing for wallet interactions and blockchain queries.

### Phase 4: Optimize and Deploy
- Optimize the application for performance and scalability.
- Deploy the refactored application to production.

---

## Conclusion

This refactor will modernize the application, making it more modular, scalable, and Solana-friendly. By adopting Next.js with TypeScript and integrating key Solana libraries, the app will be well-positioned to support advanced features like staking and governance while maintaining a robust development experience.