import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import { RegisterData } from '../types/auth';
import * as authService from '../services/auth.service';
import { UserType, AuthErrorType } from '../services/auth.service';
import { AuthContext } from './AuthContext.context';
import { supabase } from '../config/supabase';

export interface ExtendedAuthContextType {
  user: UserType | null;
  login: (email: string, password: string) => Promise<{ error?: AuthErrorType }>;
  register: (userData: RegisterData) => Promise<{ error?: AuthErrorType }>;
  logout: () => Promise<{ error?: AuthErrorType }>;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  walletAddress: string | undefined;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const address = useAddress();
  const connectMetamask = useMetamask();
  const disconnect = useDisconnect();

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);
    setIsLoading(false);

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await authService.signIn(email, password);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      return { error: err as AuthErrorType };
    }
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    try {
      const { error } = await authService.signUp(userData.email, userData.password);
      if (error) throw error;
      
      // After successful registration, store additional user data in a Supabase table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: (await authService.getSession()).session?.user.id,
            name: userData.name,
            role: userData.role,
            location: userData.location,
            wallet_address: address
          }
        ]);

      if (profileError) throw profileError;
      return { error: null };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
      return { error: err as AuthErrorType };
    }
  }, [address]);

  const logout = useCallback(async () => {
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      return { error: null };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
      return { error: err as AuthErrorType };
    }
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      await connectMetamask();
      if (user) {
        // Update the user's wallet address in their profile
        const { error } = await supabase
          .from('user_profiles')
          .update({ wallet_address: address })
          .eq('user_id', user.id);
        
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    }
  }, [connectMetamask, user, address]);

  const disconnectWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const contextValue = useMemo(() => ({
    user,
    login,
    register,
    logout,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    walletAddress: address
  }), [user, login, register, logout, isLoading, error, connectWallet, disconnectWallet, address]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};