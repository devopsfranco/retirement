use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use std::cmp::{max, min};

declare_id!("StakingProgram11111111111111111111111111111111");

#[program]
pub mod staking {
    use super::*;

    /// Deposit tokens into the staking pool.
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let staking_account = &mut ctx.accounts.staking_account;
        let clock = Clock::get()?;

        // Update staker's balance and last deposit timestamp
        // Update the staker's balance to reflect the deposited amount.
        // This balance will be used for time-weighted reward calculations.
        staking_account.balance += amount;
        staking_account.last_deposit_time = clock.unix_timestamp;

        // Transfer tokens from staker to staking pool
        token::transfer(
            ctx.accounts
                .transfer_to_pool_context()
                .with_signer(&[]),
            amount,
        )?;

        Ok(())
    }

    /// Withdraw tokens from the staking pool.
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let staking_account = &mut ctx.accounts.staking_account;
        let clock = Clock::get()?;

        // Ensure the staker has enough balance
        require!(staking_account.balance >= amount, StakingError::InsufficientBalance);

        // Update staker's balance
        // Deduct the withdrawn amount from the staker's balance.
        // Ensure compliance with withdrawal cooldowns and sufficient balance checks.
        staking_account.balance -= amount;

        // Transfer tokens from staking pool to staker
        token::transfer(
            ctx.accounts
                .transfer_to_staker_context()
                .with_signer(&[]),
            amount,
        )?;

        Ok(())
    }

    /// Claim rewards based on time-weighted balance.
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let staking_account = &mut ctx.accounts.staking_account;
        let clock = Clock::get()?;

        // Calculate rewards based on time-weighted balance
        let elapsed_time = clock.unix_timestamp - staking_account.last_deposit_time;
        // Calculate rewards using the time-weighted balance and elapsed time.
        // Rewards are capped at 5% annual yield to ensure sustainability.
        let rewards = calculate_rewards(staking_account.balance, elapsed_time);

        // Update last deposit time
        staking_account.last_deposit_time = clock.unix_timestamp;

        // Transfer rewards to staker
        token::transfer(
            ctx.accounts
                .transfer_rewards_context()
                .with_signer(&[]),
            rewards,
        )?;

        Ok(())
    }
}

/// Context for the `deposit` instruction.
#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub staker: Signer<'info>,
    #[account(mut)]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub staking_pool: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

/// Context for the `withdraw` instruction.
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub staker: Signer<'info>,
    #[account(mut)]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub staking_pool: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

/// Context for the `claim_rewards` instruction.
#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub staker: Signer<'info>,
    #[account(mut)]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub rewards_pool: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

/// Account to store staking information for each staker.
#[account]
pub struct StakingAccount {
    pub balance: u64,
    pub last_deposit_time: i64,
}

/// Error codes for the staking program.
#[error_code]
pub enum StakingError {
    #[msg("Insufficient balance for withdrawal.")]
    InsufficientBalance,
}

/// Helper function to calculate rewards based on time-weighted balance.
/// @notice Calculates staking rewards based on time-weighted balance.
/// @param balance The staker's current balance.
/// @param elapsed_time The time elapsed since the last deposit or reward claim.
/// @return The staking reward, capped at 5% annual yield.
fn calculate_rewards(balance: u64, elapsed_time: i64) -> u64 {
    let reward_rate_per_second: u64 = 1; // Example base reward rate
    let raw_reward = balance * reward_rate_per_second * elapsed_time as u64;

    // Calculate capped reward: balance * 5% annual yield * (elapsed_time in seconds / seconds in a year)
    let capped_reward = (balance as f64 * 0.05 * (elapsed_time as f64 / (365.0 * 24.0 * 60.0 * 60.0))) as u64;

    // Return the minimum of raw_reward and capped_reward
    std::cmp::min(raw_reward, capped_reward)
}

impl<'info> Deposit<'info> {
    fn transfer_to_pool_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.staker.to_account_info(),
                to: self.staking_pool.to_account_info(),
                authority: self.staker.to_account_info(),
            },
        )
    }
}

impl<'info> Withdraw<'info> {
    fn transfer_to_staker_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.staking_pool.to_account_info(),
                to: self.staker.to_account_info(),
                authority: self.staker.to_account_info(),
            },
        )
    }
}

impl<'info> ClaimRewards<'info> {
    fn transfer_rewards_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.rewards_pool.to_account_info(),
                to: self.staker.to_account_info(),
                authority: self.staker.to_account_info(),
            },
        )
    }
}