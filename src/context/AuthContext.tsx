import React, { createContext, useState, useEffect } from 'react';
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import { User } from '../types';
import { RegisterData } from '../types/auth';
import * as authService from '../services/auth.service';
import { UserType, AuthErrorType } from '../services/auth.service';

interface ExtendedAuthContextType {
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

export const AuthContext = createContext<ExtendedAuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const address = useAddress();
  const connectMetamask = useMetamask();
  const disconnect = useDisconnect();

  const refreshToken = useCallback(async (): Promise<boolean> => {
    const session = sessionManager.getCurrentSession();
    if (!session?.refreshToken) return false;

    try {
      const decoded = authManager.verifyRefreshToken(session.refreshToken);
      if (!decoded) return false;

      const { token, refreshToken: newRefreshToken } = authManager.generateTokens(session.user);
      
      sessionManager.startSession({
        user: session.user,
        token,
        refreshToken: newRefreshToken,
        expiresAt: Date.now() + 3600000, // 1 hour
      });

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, [authManager, sessionManager]);

  const connectWallet = useCallback(async () => {
    try {
      // @ts-expect-error: useMetamask is deprecated but still works
      const signer = await connectMetamask();
      if (user && signer && address) {
        const updatedUser = { ...user, walletAddress: address };
        const { token, refreshToken } = authManager.generateTokens(updatedUser);
        
        sessionManager.startSession({
          user: updatedUser,
          token,
          refreshToken,
          expiresAt: Date.now() + 3600000,
        });
        
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  }, [user, authManager, sessionManager, address, connectMetamask]);

  const disconnectWallet = useCallback(() => {
    disconnect();
    if (user) {
      const updatedUser = { ...user, walletAddress: '' };
      const { token, refreshToken } = authManager.generateTokens(updatedUser);
      
      sessionManager.startSession({
        user: updatedUser,
        token,
        refreshToken,
        expiresAt: Date.now() + 3600000,
      });
      
      setUser(updatedUser);
    }
  }, [user, authManager, sessionManager, disconnect]);

  const logout = useCallback(() => {
    sessionManager.endSession();
    setUser(null);
    disconnectWallet();
  }, [sessionManager, disconnectWallet]);

  const handleTokenRefresh = useCallback(async () => {
    await refreshToken();
  }, [refreshToken]);

  useEffect(() => {
    const initializeAuth = async () => {
      const session = sessionManager.getCurrentSession();
      if (session?.token && sessionManager.isSessionValid()) {
        try {
          const decoded = authManager.verifyToken(session.token);
          if (decoded) {
            setUser(session.user);
          }
        } catch (error) {
          console.error('Invalid session token:', error);
          sessionManager.endSession();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();

    window.addEventListener('tokenRefreshNeeded', handleTokenRefresh);
    return () => {
      window.removeEventListener('tokenRefreshNeeded', handleTokenRefresh);
    };
  }, [sessionManager, handleTokenRefresh, authManager]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      type StoredUser = User & { password: string };
      const foundUser = users.find((u: StoredUser) => u.email === email && u.password === password);

      if (!foundUser) {
        setError('Invalid email or password');
        return false;
      }

      const mockUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        location: foundUser.location || '',
        walletAddress: address || '',
        tokenVersion: foundUser.tokenVersion || 0,
      };

      const { token, refreshToken } = authManager.generateTokens(mockUser);
      
      sessionManager.startSession({
        user: mockUser,
        token,
        refreshToken,
        expiresAt: Date.now() + 3600000,
      });

      setUser(mockUser);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authManager, sessionManager, address]);

  const register = useCallback(async (userData: RegisterData): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      if (!userData.email || !userData.password || !userData.name || !userData.role) {
        setError('Missing required fields');
        return false;
      }

      // Check if user already exists
      const existingUsers = localStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      if (users.some((u: User) => u.email === userData.email)) {
        setError('Email already registered');
        return false;
      }
      
      const newUser: User = {
        id: Math.random().toString(36).slice(2, 11),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        location: userData.location || '',
        walletAddress: '',  // Will be set later when connecting wallet
        tokenVersion: 0,
      };

      // Store user in localStorage
      users.push({ ...newUser, password: userData.password }); // In a real app, this would be hashed
      localStorage.setItem('users', JSON.stringify(users));

      const { token, refreshToken } = authManager.generateTokens(newUser);
      
      sessionManager.startSession({
        user: newUser,
        token,
        refreshToken,
        expiresAt: Date.now() + 3600000
      });

      setUser(newUser);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authManager, sessionManager]);

  const contextValue = useMemo(() => ({
    user,
    login,
    register,
    logout,
    connectWallet,
    disconnectWallet,
    isLoading,
    error,
    walletAddress: address,
    refreshToken: sessionManager.getCurrentSession()?.refreshToken,
  }), [
    user,
    login,
    register,
    logout,
    connectWallet,
    disconnectWallet,
    isLoading,
    error,
    address,
    sessionManager
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
