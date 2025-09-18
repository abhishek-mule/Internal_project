import { PaymentProvider, PaymentResult } from './PaymentProvider';
import { ethers } from 'ethers';

export class CryptoPaymentProvider implements PaymentProvider {
  private provider: ethers.providers.Web3Provider;

  constructor(provider: ethers.providers.Web3Provider) {
    this.provider = provider;
  }

  async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    try {
      const signer = this.provider.getSigner();
      const tx = await signer.sendTransaction({
        to: process.env.VITE_PAYMENT_RECEIVER_ADDRESS,
        value: ethers.utils.parseEther(amount.toString()),
      });

      await tx.wait();

      return {
        success: true,
        paymentId: tx.hash,
        transactionHash: tx.hash,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  async validatePayment(paymentId: string): Promise<boolean> {
    try {
      const tx = await this.provider.getTransaction(paymentId);
      if (!tx) return false;

      const receipt = await tx.wait();
      return receipt.status === 1;
    } catch {
      return false;
    }
  }

  async refundPayment(paymentId: string): Promise<boolean> {
    try {
      const tx = await this.provider.getTransaction(paymentId);
      if (!tx) return false;

      const signer = this.provider.getSigner();
      const refundTx = await signer.sendTransaction({
        to: tx.from,
        value: tx.value,
      });

      const receipt = await refundTx.wait();
      return receipt.status === 1;
    } catch {
      return false;
    }
  }
}