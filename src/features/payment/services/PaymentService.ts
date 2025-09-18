import { PaymentProvider } from './PaymentProvider';
import { CryptoPaymentProvider } from './CryptoPaymentProvider';
import { FiatPaymentProvider } from './FiatPaymentProvider';
import { TransactionQueue } from '../../../core/contracts/TransactionQueue';
import { ethers } from 'ethers';

export interface PaymentDetails {
  amount: number;
  currency: string;
  productId: string;
  userId: string;
  paymentMethod: 'crypto' | 'fiat';
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  transactionHash?: string;
  error?: string;
  paymentMethod: 'crypto' | 'fiat';
  amount: number;
  currency: string;
  timestamp: number;
}

export class PaymentService {
  private cryptoProvider: CryptoPaymentProvider;
  private fiatProvider: FiatPaymentProvider;
  private transactionQueue: TransactionQueue;

  constructor() {
    // Initialize with default providers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    this.cryptoProvider = new CryptoPaymentProvider(provider);
    this.fiatProvider = new FiatPaymentProvider(process.env.VITE_STRIPE_PUBLIC_KEY || '');
    this.transactionQueue = TransactionQueue.getInstance();
  }

  public validatePaymentDetails(details: PaymentDetails): boolean {
    return !!(
      details.amount > 0 &&
      details.currency &&
      details.productId &&
      details.userId &&
      details.paymentMethod
    );
  }

  private getProvider(method: 'crypto' | 'fiat'): PaymentProvider {
    return method === 'crypto' ? this.cryptoProvider : this.fiatProvider;
  }

  public async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    if (!this.validatePaymentDetails(details)) {
      throw new Error('Invalid payment details');
    }

    const provider = this.getProvider(details.paymentMethod);
    const paymentPromise = () =>
      provider.processPayment(details.amount, details.currency);

    // Add payment to queue and get transaction ID
    const transactionId = await this.transactionQueue.addTransaction(
      paymentPromise,
      3 // Max attempts
    );

    // Monitor transaction status
    const checkStatus = async (): Promise<PaymentResult> => {
      const status = this.transactionQueue.getTransactionStatus(transactionId);
      
      switch (status) {
        case 'processing':
          await new Promise(resolve => setTimeout(resolve, 1000));
          return checkStatus();
        
        case 'not_found':
          return {
            success: false,
            error: 'Payment transaction not found',
            paymentMethod: details.paymentMethod,
            amount: details.amount,
            currency: details.currency,
            timestamp: Date.now()
          };
        
        default:
          // For completed transactions, validate the payment
          const paymentResult = await paymentPromise();
          if (paymentResult.success && paymentResult.paymentId) {
            const isValid = await provider.validatePayment(paymentResult.paymentId);
            
            if (!isValid) {
              return {
                success: false,
                error: 'Payment validation failed',
                paymentMethod: details.paymentMethod,
                amount: details.amount,
                currency: details.currency,
                timestamp: Date.now()
              };
            }
          }
          
          return {
            ...paymentResult,
            paymentMethod: details.paymentMethod,
            amount: details.amount,
            currency: details.currency,
            timestamp: Date.now()
          };
      }
    };

    return checkStatus();
  }

  public async refundPayment(paymentId: string, method: 'crypto' | 'fiat'): Promise<boolean> {
    const provider = this.getProvider(method);
    return provider.refundPayment(paymentId);
  }
}