import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  walletAddress: string | undefined;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  walletAddress: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setTokens: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setWalletAddress: (state, action: PayloadAction<string | undefined>) => {
      state.walletAddress = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.walletAddress = undefined;
    },
  },
});

export const {
  setUser,
  setTokens,
  setLoading,
  setError,
  setWalletAddress,
  logout,
} = authSlice.actions;

export const authReducer = authSlice.reducer;