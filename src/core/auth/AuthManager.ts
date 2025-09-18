import { User } from '../../types';

// Instead of using jsonwebtoken which requires Node.js crypto, 
// we'll use a simple token generation for the browser
export class AuthManager {
  private static instance: AuthManager;
  private static SECRET_KEY = import.meta.env.VITE_JWT_SECRET || 'your-secret-key-farmconnect';

  private constructor() {}

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  private generateRandomString(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  public generateTokens(user: User): { token: string; refreshToken: string } {
    // Create a simple token structure with user data and expiration
    const now = Date.now();
    const token = btoa(JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      exp: now + 3600000, // 1 hour
      random: this.generateRandomString(16)
    }));

    const refreshToken = btoa(JSON.stringify({
      id: user.id,
      tokenVersion: user.tokenVersion,
      exp: now + 7 * 24 * 3600000, // 7 days
      random: this.generateRandomString(16)
    }));

    return { token, refreshToken };
  }

  public verifyToken(token: string): { id: string; email: string; role: string; exp: number } | null {
    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.exp < Date.now()) {
        return null; // Token expired
      }
      return decoded;
    } catch (error) {
      return null;
    }
  }

  public verifyRefreshToken(refreshToken: string): { id: string; tokenVersion: number } | null {
    try {
      const decoded = JSON.parse(atob(refreshToken));
      if (decoded.exp < Date.now()) {
        return null; // Token expired
      }
      return {
        id: decoded.id,
        tokenVersion: decoded.tokenVersion
      };
    } catch (error) {
      return null;
    }
  }

  public parseToken(token: string): User | null {
    try {
      const decoded = JSON.parse(atob(token));
      if (!decoded) return null;

      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        tokenVersion: decoded.tokenVersion || 0,
        name: decoded.name,
        walletAddress: decoded.walletAddress || '',
        location: decoded.location || ''
      };
    } catch {
      return null;
    }
  }
}