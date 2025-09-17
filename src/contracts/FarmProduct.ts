import { SmartContract } from "@thirdweb-dev/sdk";
import { BaseContract, BigNumber } from "ethers";
import { NFTMetadata } from "../types";

export class FarmProductContract {
  private contract: SmartContract<BaseContract>;

  constructor(contract: SmartContract<BaseContract>) {
    this.contract = contract;
  }

  async mintProduct(metadata: NFTMetadata): Promise<string> {
    try {
      const tx = await this.contract.erc721.mint({
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        properties: metadata.properties
      });

      return tx.id.toString();
    } catch (error) {
      console.error("Error minting farm product NFT:", error);
      throw error;
    }
  }

  async getProduct(tokenId: string) {
    try {
      const nft = await this.contract.erc721.get(tokenId);
      return nft;
    } catch (error) {
      console.error("Error fetching farm product:", error);
      throw error;
    }
  }

  async transferProduct(to: string, tokenId: string) {
    try {
      await this.contract.erc721.transfer(to, tokenId);
    } catch (error) {
      console.error("Error transferring farm product:", error);
      throw error;
    }
  }

  async getOwner(tokenId: string): Promise<string> {
    try {
      const owner = await this.contract.erc721.ownerOf(tokenId);
      return owner;
    } catch (error) {
      console.error("Error getting product owner:", error);
      throw error;
    }
  }

  async getOwnedProducts(address: string) {
    try {
      const nfts = await this.contract.erc721.getOwned(address);
      return nfts;
    } catch (error) {
      console.error("Error fetching owned products:", error);
      throw error;
    }
  }
}