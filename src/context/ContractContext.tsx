import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAddress } from '@thirdweb-dev/react';
import { contractService } from '../contracts/ContractService';
import { NFTMetadata } from '../types';

interface ContractContextType {
  mintProduct: (metadata: NFTMetadata) => Promise<string>;
  getProduct: (tokenId: string) => Promise<any>;
  transferProduct: (to: string, tokenId: string) => Promise<void>;
  listProduct: (tokenId: string, price: number) => Promise<void>;
  buyProduct: (tokenId: string, price: number) => Promise<void>;
  getOwnedProducts: () => Promise<any[]>;
  getAllListings: () => Promise<any[]>;
  isLoading: boolean;
  error: string | null;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const address = useAddress();

  useEffect(() => {
    initializeContracts();
  }, []);

  const initializeContracts = async () => {
    try {
      await contractService.initializeContracts();
      setIsLoading(false);
    } catch (err) {
      setError("Failed to initialize contracts");
      setIsLoading(false);
    }
  };

  const mintProduct = async (metadata: NFTMetadata) => {
    try {
      return await contractService.getFarmProductContract().mintProduct(metadata);
    } catch (err) {
      setError("Failed to mint product");
      throw err;
    }
  };

  const getProduct = async (tokenId: string) => {
    try {
      return await contractService.getFarmProductContract().getProduct(tokenId);
    } catch (err) {
      setError("Failed to fetch product");
      throw err;
    }
  };

  const transferProduct = async (to: string, tokenId: string) => {
    try {
      await contractService.getFarmProductContract().transferProduct(to, tokenId);
    } catch (err) {
      setError("Failed to transfer product");
      throw err;
    }
  };

  const listProduct = async (tokenId: string, price: number) => {
    try {
      await contractService.getMarketplaceContract().listProduct(tokenId, price);
    } catch (err) {
      setError("Failed to list product");
      throw err;
    }
  };

  const buyProduct = async (tokenId: string, price: number) => {
    try {
      await contractService.getMarketplaceContract().buyProduct(tokenId, price);
    } catch (err) {
      setError("Failed to buy product");
      throw err;
    }
  };

  const getOwnedProducts = async () => {
    if (!address) return [];
    try {
      return await contractService.getFarmProductContract().getOwnedProducts(address);
    } catch (err) {
      setError("Failed to fetch owned products");
      throw err;
    }
  };

  const getAllListings = async () => {
    try {
      return await contractService.getMarketplaceContract().getAllListings();
    } catch (err) {
      setError("Failed to fetch listings");
      throw err;
    }
  };

  return (
    <ContractContext.Provider
      value={{
        mintProduct,
        getProduct,
        transferProduct,
        listProduct,
        buyProduct,
        getOwnedProducts,
        getAllListings,
        isLoading,
        error
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};