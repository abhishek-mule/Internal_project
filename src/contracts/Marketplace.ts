import { SmartContract } from "@thirdweb-dev/sdk";
import { BaseContract as TWBaseContract } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import { BaseContract } from "../core/contracts/BaseContract";
import { ContractManager } from "../core/contracts/ContractManager";
import { CacheManager } from "../core/cache/CacheManager";

interface ProductListing {
  tokenId: string;
  seller: string;
  price: string;
  active: boolean;
}

export class MarketplaceContract extends BaseContract {
  private cacheManager: CacheManager;
  private contractManager: ContractManager;

  constructor(contract: SmartContract<TWBaseContract>) {
    super(contract);
    this.cacheManager = CacheManager.getInstance();
    this.contractManager = ContractManager.getInstance();
  }

  async listProduct(tokenId: string, price: number) {
    if (!tokenId || price <= 0) {
      throw new Error('Invalid listing parameters');
    }

    return this.executeWithRetry(
      async () => {
        const priceInWei = ethers.utils.parseEther(price.toString());
        await this.contract.call("listItem", [tokenId, priceInWei]);
        this.cacheManager.clearContractCache();
      },
      'List product'
    );
  }

  async buyProduct(tokenId: string, price: number) {
    if (!tokenId || price <= 0) {
      throw new Error('Invalid purchase parameters');
    }

    return this.executeWithRetry(
      async () => {
        const priceInWei = ethers.utils.parseEther(price.toString());
        await this.contract.call("buyItem", [tokenId], { value: priceInWei });
        this.cacheManager.clearContractCache();
      },
      'Buy product'
    );
  }

  async cancelListing(tokenId: string) {
    if (!tokenId) {
      throw new Error('Invalid token ID');
    }

    return this.executeWithRetry(
      async () => {
        await this.contract.call("cancelListing", [tokenId]);
        this.cacheManager.clearContractCache();
      },
      'Cancel listing'
    );
  }

  async getProductListing(tokenId: string): Promise<ProductListing> {
    const cacheKey = `listing-${tokenId}`;
    const cachedListing = this.cacheManager.get<ProductListing>(cacheKey);
    
    if (cachedListing) {
      return cachedListing;
    }

    return this.executeWithRetry(
      async () => {
        const listing = await this.contract.call("getListing", [tokenId]);
        const formattedListing = {
          tokenId: listing.tokenId.toString(),
          seller: listing.seller,
          price: ethers.utils.formatEther(listing.price),
          active: listing.active
        };
        this.cacheManager.set(cacheKey, formattedListing);
        return formattedListing;
      },
      'Get product listing'
    );
  }

  async getAllListings(): Promise<ProductListing[]> {
    const cacheKey = 'all-listings';
    const cachedListings = this.cacheManager.get<ProductListing[]>(cacheKey);
    
    if (cachedListings) {
      return cachedListings;
    }

    return this.executeWithRetry(
      async () => {
        const listings = await this.contract.call("getAllListings");
        const formattedListings = listings.map((listing: any) => ({
          tokenId: listing.tokenId.toString(),
          seller: listing.seller,
          price: ethers.utils.formatEther(listing.price),
          active: listing.active
        }));
        this.cacheManager.set(cacheKey, formattedListings);
        return formattedListings;
      },
      'Get all listings'
    );
  }
}