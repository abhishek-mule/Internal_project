import { useEffect, useState } from 'react';
import { ContractManager } from '../core/contracts/ContractManager';
import { FarmProductContract } from '../contracts/FarmProduct';

type ContractType = 'FarmProduct';
type ContractReturnType = FarmProductContract;

export function useContract(contractType: ContractType): { 
  contract: ContractReturnType | null;
  isLoading: boolean;
  error: string | null;
} {
  const [contract, setContract] = useState<ContractReturnType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContract = async () => {
      setError(null);
      setIsLoading(true);
      
      try {
        const contractManager = ContractManager.getInstance();
        let contract;
        
        if (contractType === 'FarmProduct') {
          contract = await contractManager.getFarmProductContract();
        } else {
          throw new Error(`Unsupported contract type: ${contractType}`);
        }
        
        setContract(contract);
        setIsLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load contract';
        setError(message);
        setIsLoading(false);
        setContract(null);
      }
    };

    loadContract();
  }, [contractType]);

  return {
    contract,
    isLoading,
    error
  };
}