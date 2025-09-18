export interface PaymentDetails {
  amount: number;
  currency: string;
  productId: string;
  userId: string;
  paymentMethod: PaymentMethodType;
}

export type PaymentMethodType = 'crypto' | 'fiat';

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  transactionHash?: string;
  error?: string;
  paymentMethod: PaymentMethodType;
  amount: number;
  currency: string;
  timestamp: number;
}

export interface PaymentProviderInterface {
  processPayment(amount: number, currency: string): Promise<PaymentResult>;
  validatePayment(paymentId: string): Promise<boolean>;
  refundPayment(paymentId: string): Promise<boolean>;
}

export interface PaymentMethodInfo {
  id: PaymentMethodType;
  name: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

export interface PaymentState {
  currentPayment: PaymentDetails | null;
  paymentHistory: PaymentResult[];
  isProcessing: boolean;
  error: string | null;
}