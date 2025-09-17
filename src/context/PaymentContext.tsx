import React, { createContext, useContext, useState } from 'react';
import { PaymentService, PaymentDetails, PaymentResult } from '../services/PaymentService';
import { useContract } from './ContractContext';

interface PaymentContextType {
  processPayment: (details: PaymentDetails, method: 'crypto' | 'fiat') => Promise<PaymentResult>;
  isProcessing: boolean;
  error: string | null;
  clearError: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paymentService = new PaymentService();
  const { buyProduct } = useContract();

  const clearError = () => setError(null);

  const processPayment = async (
    details: PaymentDetails,
    method: 'crypto' | 'fiat'
  ): Promise<PaymentResult> => {
    setIsProcessing(true);
    setError(null);

    try {
      if (!paymentService.validatePaymentDetails(details)) {
        throw new Error('Invalid payment details');
      }

      let result: PaymentResult;

      if (method === 'crypto') {
        // For crypto payments, we first process the blockchain transaction
        await buyProduct(details.productId, details.amount);
        result = await paymentService.processCryptoPayment(details);
      } else {
        // For fiat payments, we use traditional payment processing
        result = await paymentService.processFiatPayment(details);
        // After successful fiat payment, we still need to transfer the NFT
        await buyProduct(details.productId, details.amount);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        processPayment,
        isProcessing,
        error,
        clearError,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};