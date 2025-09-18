import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { FarmProductContract } from "./FarmProduct";
import { MarketplaceContract } from "./Marketplace";
import { CONTRACT_ADDRESSES, NETWORK } from "../config/web3Config";

export class ContractService {
  private sdk: ThirdwebSDK;
  private farmProductContract: FarmProductContract | null = null;
  private marketplaceContract: MarketplaceContract | null = null;

  constructor() {
    this.sdk = new ThirdwebSDK(NETWORK);
  }

  async initializeContracts() {
    try {
      // Initialize FarmProduct Contract
      if (CONTRACT_ADDRESSES.NFT_CONTRACT) {
        const nftContract = await this.sdk.getContract(CONTRACT_ADDRESSES.NFT_CONTRACT);
        this.farmProductContract = new FarmProductContract(nftContract);
      }

      // Initialize Marketplace Contract
      if (CONTRACT_ADDRESSES.MARKETPLACE_CONTRACT) {
        const marketContract = await this.sdk.getContract(CONTRACT_ADDRESSES.MARKETPLACE_CONTRACT);
        this.marketplaceContract = new MarketplaceContract(marketContract);
      }
    } catch (error) {
      console.error("Error initializing contracts:", error);
      throw error;
    }
  }

  getFarmProductContract(): FarmProductContract {
    if (!this.farmProductContract) {
      throw new Error("FarmProduct contract not initialized");
    }
    return this.farmProductContract;
  }

  getMarketplaceContract(): MarketplaceContract {
    if (!this.marketplaceContract) {
      throw new Error("Marketplace contract not initialized");
    }
    return this.marketplaceContract;
  }

  // Helper method to check if contracts are initialized
  isInitialized(): boolean {
    return !!this.farmProductContract; // Only check for NFT contract since marketplace is optional
  }
}

// Export singleton instance
export const contractService = new ContractService();