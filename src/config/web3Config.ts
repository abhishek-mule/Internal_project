import { Chain, Mumbai } from '@thirdweb-dev/chains';

export const NETWORK: Chain = Mumbai;

// Replace with your actual smart contract addresses
export const CONTRACT_ADDRESSES = {
  NFT_CONTRACT: process.env.VITE_NFT_CONTRACT_ADDRESS || '',
  MARKETPLACE_CONTRACT: process.env.VITE_MARKETPLACE_CONTRACT_ADDRESS || '',
};

export const THIRDWEB_CLIENT_ID = process.env.VITE_THIRDWEB_CLIENT_ID || '';