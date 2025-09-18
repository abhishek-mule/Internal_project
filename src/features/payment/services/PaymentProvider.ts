export interface PaymentProvider {
  processPayment(amount: number, currency: string): Promise<PaymentResult>;
  validatePayment(paymentId: string): Promise<boolean>;
  refundPayment(paymentId: string): Promise<boolean>;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
  transactionHash?: string;
}