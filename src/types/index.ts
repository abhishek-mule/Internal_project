export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'middleman' | 'admin';
  avatar?: string;
  phone?: string;
  location?: string;
  walletAddress?: string;
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
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface PaymentMethod {
  id: string;
  type: 'crypto' | 'upi' | 'bank';
  name: string;
  identifier: string;
  icon: string;
}