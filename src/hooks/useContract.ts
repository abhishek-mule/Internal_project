import { useContract as useThirdwebContract } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";

export function useContract(contractType: string) {
  const contractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS || "0xe0A39Cd3326Edeb782B9C1Ee6dD000c2cB8Fe246";
  const { data: contract, isLoading, error } = useThirdwebContract(
    contractAddress,
    contractType === 'FarmProduct' ? 'nft-collection' : undefined
  );

  return {
    contract: contract as SmartContract,
    isLoading,
    error
  };
}