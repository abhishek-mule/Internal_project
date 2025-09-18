import { ThirdwebSDK, SmartContract, BaseContract as TWBaseContract } from '@thirdweb-dev/sdk';
import { FarmProductContract } from '../../contracts/FarmProduct';
import { MarketplaceContract } from '../../contracts/Marketplace';
import { CacheManager } from '../cache/CacheManager';
import { CONTRACT_ADDRESSES, NETWORK } from '../../config/web3Config';

export class ContractManager {
  private static instance: ContractManager;
  private sdk: ThirdwebSDK;
  private contracts: Map<string, SmartContract<TWBaseContract>> = new Map();
  private cacheManager: CacheManager;

  private constructor() {
    this.sdk = new ThirdwebSDK(NETWORK);
    this.cacheManager = CacheManager.getInstance();
  }

  public static getInstance(): ContractManager {
    if (!ContractManager.instance) {
      ContractManager.instance = new ContractManager();
    }
    return ContractManager.instance;
  }

  public async initialize(): Promise<void> {
    await this.initializeContract(CONTRACT_ADDRESSES.NFT_CONTRACT, 'farmProduct');
    await this.initializeContract(CONTRACT_ADDRESSES.MARKETPLACE_CONTRACT, 'marketplace');
  }

  private async initializeContract(address: string, name: string): Promise<void> {
    try {
      const contract = await this.sdk.getContract(address);
      this.contracts.set(name, contract);
    } catch (error) {
      console.error(`Failed to initialize ${name} contract:`, error);
      throw error;
    }
  }

  public getFarmProductContract(): FarmProductContract {
    const contract = this.contracts.get('farmProduct');
    if (!contract) {
      throw new Error('FarmProduct contract not initialized');
    }
    return new FarmProductContract(contract);
  }

  public getMarketplaceContract(): MarketplaceContract {
    const contract = this.contracts.get('marketplace');
    if (!contract) {
      throw new Error('Marketplace contract not initialized');
    }
    return new MarketplaceContract(contract);
  }

  public clearCache(): void {
    this.cacheManager.clearContractCache();
  }
}