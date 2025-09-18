import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  isProcessing: boolean;
  error: string | null;
  activePayments: {
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    productId: string;
    method: 'crypto' | 'fiat';
  }[];
}

const initialState: PaymentState = {
  isProcessing: false,
  error: null,
  activePayments: [],
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addPayment: (
      state,
      action: PayloadAction<{
        id: string;
        amount: number;
        productId: string;
        method: 'crypto' | 'fiat';
      }>
    ) => {
      state.activePayments.push({
        ...action.payload,
        status: 'pending',
      });
    },
    updatePaymentStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: 'pending' | 'processing' | 'completed' | 'failed';
      }>
    ) => {
      const payment = state.activePayments.find(p => p.id === action.payload.id);
      if (payment) {
        payment.status = action.payload.status;
      }
    },
    removePayment: (state, action: PayloadAction<string>) => {
      state.activePayments = state.activePayments.filter(
        payment => payment.id !== action.payload
      );
    },
    clearCompletedPayments: (state) => {
      state.activePayments = state.activePayments.filter(
        payment => payment.status !== 'completed' && payment.status !== 'failed'
      );
    },
  },
});

export const {
  setProcessing,
  setError,
  addPayment,
  updatePaymentStatus,
  removePayment,
  clearCompletedPayments,
} = paymentSlice.actions;

export const paymentReducer = paymentSlice.reducer;