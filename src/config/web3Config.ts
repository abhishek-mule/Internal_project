import { Chain } from '@thirdweb-dev/chains';

// API Key configuration
export const THIRDWEB_API_KEY = import.meta.env.VITE_THIRDWEB_API_KEY || '';

// Custom chain configuration for Polygon Amoy testnet
export const NETWORK: Chain = {
  chainId: Number(import.meta.env.VITE_APP_CHAIN_ID || 80002),
  rpc: [import.meta.env.VITE_APP_RPC_URL || 'https://rpc-amoy.polygon.technology'],
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  shortName: 'amoy',
  slug: 'polygon-amoy',
  testnet: true,
  chain: 'Polygon',
  name: 'Polygon Amoy Testnet',
};

// Contract addresses from environment
export const CONTRACT_ADDRESSES = {
  NFT_CONTRACT: import.meta.env.VITE_NFT_CONTRACT_ADDRESS || '',
  MARKETPLACE_CONTRACT: import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS || '',
};

// ThirdWeb client ID from environment
export const THIRDWEB_CLIENT_ID = import.meta.env.VITE_APP_THIRDWEB_CLIENT_ID || '';