export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'middleman' | 'admin';
  avatar?: string;
  phone?: string;
  location: string;
  walletAddress: string;
  tokenVersion: number;
}

export interface Crop {
  id: string;
  name: string;
  variety: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  status: 'growing' | 'ready' | 'harvested' | 'sold';
  plantedDate: string;
  expectedHarvest: string;
  progress: number;
  health: number;
  icon: string;
  nftId?: string;
  tokenUri?: string;
}

export interface CropMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    variety: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    plantedDate: string;
    expectedHarvest: string;
    status: 'growing' | 'ready' | 'harvested' | 'sold';
    progress: number;
    health: number;
  };
}

export interface Shipment {
  id: string;
  orderId: string;
  from: string;
  to: string;
  product: string;
  quantity: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
  estimatedDelivery: string;
  currentLocation: string;
  progress: number;
}

export interface Transaction {
  id: string;
  type: 'mint' | 'transfer' | 'sale';
  from: string;
  to: string;
  timestamp: number;
  amount?: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  properties: {
    timestamp: number;
    location: string;
    temperature: number;
    humidity: number;
    price?: number;
    farmer: string;
    status?: 'available' | 'sold' | 'in-transit';
    transactionHistory?: Transaction[];
  };
}

export interface NFTData extends NFTMetadata {
  id: string;
  owner: string;
}

export interface PaymentMethod {
  id: string;
  type: 'crypto' | 'upi' | 'bank';
  name: string;
  identifier: string;
  icon: string;
}