import React, { createContext, useContext, useState } from 'react';
import { PaymentService } from '../services/PaymentService';
import { useContract } from '../../../context/ContractContext';
import { PaymentDetails, PaymentResult, PaymentMethodType } from '../types';

interface PaymentContextType {
  processPayment: (details: PaymentDetails, method: PaymentMethodType) => Promise<PaymentResult>;
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
    method: PaymentMethodType
  ): Promise<PaymentResult> => {
    setIsProcessing(true);
    setError(null);

    try {
      if (!paymentService.validatePaymentDetails(details)) {
        throw new Error('Invalid payment details');
      }

      // Process the payment using the payment service
      const result = await paymentService.processPayment(details);

      // After successful payment, process the blockchain transaction
      if (result.success) {
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