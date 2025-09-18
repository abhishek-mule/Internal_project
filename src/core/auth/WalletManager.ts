import { useAddress } from '@thirdweb-dev/react';
import { AuthManager } from './AuthManager';
import { SessionManager } from './SessionManager';
import { User } from '../../types';

export class WalletManager {
  private static instance: WalletManager;
  private authManager: AuthManager;
  private sessionManager: SessionManager;

  private constructor() {
    this.authManager = AuthManager.getInstance();
    this.sessionManager = SessionManager.getInstance();
  }

  public static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  public async connectWallet(): Promise<string | null> {
    try {
      // This is handled by ThirdWeb's useMetamask hook in the component
      const address = useAddress();
      if (!address) return null;

      // Update the current session with the wallet address
      const currentSession = this.sessionManager.getCurrentSession();
      if (currentSession && currentSession.user) {
        const updatedUser: User = {
          ...currentSession.user,
          walletAddress: address,
        };
        
        // Generate new tokens with updated user info
        const { token, refreshToken } = this.authManager.generateTokens(updatedUser);
        
        // Start new session with updated tokens
        this.sessionManager.startSession({
          user: updatedUser,
          token,
          refreshToken,
          expiresAt: Date.now() + 3600000, // 1 hour
        });
      }

      return address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    }
  }

  public async disconnectWallet(): Promise<void> {
    try {
      // ThirdWeb's useDisconnect hook handles the actual disconnection
      // Here we just update our session
      const currentSession = this.sessionManager.getCurrentSession();
      if (currentSession && currentSession.user) {
        const updatedUser: User = {
          ...currentSession.user,
          walletAddress: undefined,
        };
        
        const { token, refreshToken } = this.authManager.generateTokens(updatedUser);
        
        this.sessionManager.startSession({
          user: updatedUser,
          token,
          refreshToken,
          expiresAt: Date.now() + 3600000,
        });
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }

  public getConnectedAddress(): string | undefined {
    const currentSession = this.sessionManager.getCurrentSession();
    return currentSession?.user?.walletAddress;
  }

  public isWalletConnected(): boolean {
    return !!this.getConnectedAddress();
  }
}