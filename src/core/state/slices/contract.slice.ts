import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NFTMetadata } from '../../../types';

interface ContractState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  ownedProducts: NFTMetadata[];
  listedProducts: NFTMetadata[];
  lastTransaction: {
    id: string;
    status: 'pending' | 'completed' | 'failed';
  } | null;
}

const initialState: ContractState = {
  isInitialized: false,
  isLoading: false,
  error: null,
  ownedProducts: [],
  listedProducts: [],
  lastTransaction: null,
};

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOwnedProducts: (state, action: PayloadAction<NFTMetadata[]>) => {
      state.ownedProducts = action.payload;
    },
    setListedProducts: (state, action: PayloadAction<NFTMetadata[]>) => {
      state.listedProducts = action.payload;
    },
    updateTransaction: (
      state,
      action: PayloadAction<{
        id: string;
        status: 'pending' | 'completed' | 'failed';
      }>
    ) => {
      state.lastTransaction = action.payload;
    },
    addOwnedProduct: (state, action: PayloadAction<NFTMetadata>) => {
      state.ownedProducts.push(action.payload);
    },
    removeOwnedProduct: (state, action: PayloadAction<string>) => {
      state.ownedProducts = state.ownedProducts.filter(
        product => product.id !== action.payload
      );
    },
    addListedProduct: (state, action: PayloadAction<NFTMetadata>) => {
      state.listedProducts.push(action.payload);
    },
    removeListedProduct: (state, action: PayloadAction<string>) => {
      state.listedProducts = state.listedProducts.filter(
        product => product.id !== action.payload
      );
    },
  },
});

export const {
  setInitialized,
  setLoading,
  setError,
  setOwnedProducts,
  setListedProducts,
  updateTransaction,
  addOwnedProduct,
  removeOwnedProduct,
  addListedProduct,
  removeListedProduct,
} = contractSlice.actions;

export const contractReducer = contractSlice.reducer;