import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../slices/auth.slice';
import { contractReducer } from '../slices/contract.slice';
import { paymentReducer } from '../slices/payment.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contract: contractReducer,
    payment: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['contract/setContract', 'payment/setProvider'],
        // Ignore these field paths in state for serialization checks
        ignoredPaths: ['contract.instances', 'payment.provider'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;