import { useCallback } from "react";
import { ethers } from "ethers";
import useSWR from "swr";
import { Staking__factory } from "../../typechain-types";
import { useWeb3React } from "@web3-react/core";

const STAKING_CONTRACT_ADDRESS = "0xYourStakingContractAddressHere"; // Replace with your deployed staking contract address

// Fetcher function for SWR
const fetcher = async (provider, contractAddress, method, ...args) => {
  const contract = Staking__factory.connect(contractAddress, provider);
  return contract[method](...args);
};

export const useStaking = () => {
  const { library, account } = useWeb3React();

  // Fetch staking state
  const { data: stakingState, mutate: refreshStakingState } = useSWR(
    account
      ? [library, STAKING_CONTRACT_ADDRESS, "stakers", account]
      : null,
    fetcher
  );

  // Stake tokens
  const stakeTokens = useCallback(
    async (amount) => {
      if (!library || !account) throw new Error("Wallet not connected");

      const signer = library.getSigner(account);
      const stakingContract = Staking__factory.connect(
        STAKING_CONTRACT_ADDRESS,
        signer
      );

      const tx = await stakingContract.stake(ethers.utils.parseEther(amount));
      await tx.wait();
      refreshStakingState();
    },
    [library, account, refreshStakingState]
  );

  // Withdraw staked tokens
  const withdrawTokens = useCallback(
    async (amount) => {
      if (!library || !account) throw new Error("Wallet not connected");

      const signer = library.getSigner(account);
      const stakingContract = Staking__factory.connect(
        STAKING_CONTRACT_ADDRESS,
        signer
      );

      const tx = await stakingContract.withdraw(
        ethers.utils.parseEther(amount)
      );
      await tx.wait();
      refreshStakingState();
    },
    [library, account, refreshStakingState]
  );

  // Claim rewards
  const claimRewards = useCallback(async () => {
    if (!library || !account) throw new Error("Wallet not connected");

    const signer = library.getSigner(account);
    const stakingContract = Staking__factory.connect(
      STAKING_CONTRACT_ADDRESS,
      signer
    );

    const tx = await stakingContract.claimRewards();
    await tx.wait();
    refreshStakingState();
  }, [library, account, refreshStakingState]);

  return {
    stakingState,
    stakeTokens,
    withdrawTokens,
    claimRewards,
    refreshStakingState,
  };
};
