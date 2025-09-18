import { SmartContract } from "@thirdweb-dev/sdk";
import { BaseContract as TWBaseContract } from "@thirdweb-dev/sdk";
import { BaseContract } from "../core/contracts/BaseContract";
import { ContractManager } from "../core/contracts/ContractManager";
import { CacheManager } from "../core/cache/CacheManager";
import { NFTMetadata } from "../types";

export class FarmProductContract extends BaseContract {
  private cacheManager: CacheManager;
  private contractManager: ContractManager;

  constructor(contract: SmartContract<TWBaseContract>) {
    super(contract);
    this.cacheManager = CacheManager.getInstance();
    this.contractManager = ContractManager.getInstance();
  }

  async mintProduct(metadata: NFTMetadata): Promise<string> {
    return this.executeWithRetry(
      async () => {
        const result = await this.contract.erc721.mint({
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          properties: metadata.properties
        });
        const tokenId = result.id.toString();
        
        // Invalidate cache for owned products
        this.cacheManager.clearContractCache();
        
        return tokenId;
      },
      'Mint product'
    );
  }

  async getProduct(tokenId: string) {
    const cacheKey = `product-${tokenId}`;
    const cachedProduct = this.cacheManager.get<any>(cacheKey);
    
    if (cachedProduct) {
      return cachedProduct;
    }

    return this.executeWithRetry(
      async () => {
        const metadata = await this.contract.erc721.get(tokenId);
        this.cacheManager.set(cacheKey, metadata);
        return metadata;
      },
      'Get product'
    );
  }

  async transferProduct(to: string, tokenId: string) {
    if (!this.validateAddress(to)) {
      throw new Error('Invalid destination address');
    }

    return this.executeWithRetry(
      async () => {
        await this.contract.erc721.transfer(to, tokenId);
        // Invalidate relevant caches
        this.cacheManager.clearContractCache();
      },
      'Transfer product'
    );
  }

  async getOwner(tokenId: string): Promise<string> {
    const cacheKey = `owner-${tokenId}`;
    const cachedOwner = this.cacheManager.get<string>(cacheKey);
    
    if (cachedOwner) {
      return cachedOwner;
    }

    return this.executeWithRetry(
      async () => {
        const owner = await this.contract.erc721.ownerOf(tokenId);
        this.cacheManager.set(cacheKey, owner);
        return owner;
      },
      'Get product owner'
    );
  }

  async getOwnedProducts(address: string) {
    if (!this.validateAddress(address)) {
      throw new Error('Invalid address');
    }

    const cacheKey = `owned-products-${address}`;
    const cachedProducts = this.cacheManager.get<any[]>(cacheKey);
    
    if (cachedProducts) {
      return cachedProducts;
    }

    return this.executeWithRetry(
      async () => {
        const nfts = await this.contract.erc721.getOwned(address);
        this.cacheManager.set(cacheKey, nfts);
        return nfts;
      },
      'Get owned products'
    );
  }
}