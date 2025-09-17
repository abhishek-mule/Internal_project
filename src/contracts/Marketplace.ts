import { SmartContract } from "@thirdweb-dev/sdk";
import { BaseContract, BigNumber, ethers } from "ethers";

export class MarketplaceContract {
  private contract: SmartContract<BaseContract>;

  constructor(contract: SmartContract<BaseContract>) {
    this.contract = contract;
  }

  async listProduct(tokenId: string, price: number) {
    try {
      const priceInWei = ethers.utils.parseEther(price.toString());
      await this.contract.call("listItem", [tokenId, priceInWei]);
    } catch (error) {
      console.error("Error listing product:", error);
      throw error;
    }
  }

  async buyProduct(tokenId: string, price: number) {
    try {
      const priceInWei = ethers.utils.parseEther(price.toString());
      await this.contract.call("buyItem", [tokenId], { value: priceInWei });
    } catch (error) {
      console.error("Error buying product:", error);
      throw error;
    }
  }

  async cancelListing(tokenId: string) {
    try {
      await this.contract.call("cancelListing", [tokenId]);
    } catch (error) {
      console.error("Error canceling listing:", error);
      throw error;
    }
  }

  async getProductListing(tokenId: string) {
    try {
      const listing = await this.contract.call("getListing", [tokenId]);
      return {
        seller: listing.seller,
        price: ethers.utils.formatEther(listing.price),
        active: listing.active
      };
    } catch (error) {
      console.error("Error fetching product listing:", error);
      throw error;
    }
  }

  async getAllListings() {
    try {
      const listings = await this.contract.call("getAllListings");
      return listings.map((listing: any) => ({
        tokenId: listing.tokenId.toString(),
        seller: listing.seller,
        price: ethers.utils.formatEther(listing.price),
        active: listing.active
      }));
    } catch (error) {
      console.error("Error fetching all listings:", error);
      throw error;
    }
  }
}