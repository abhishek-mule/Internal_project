import { User } from '.';

export type UserRole = 'farmer' | 'middleman' | 'admin';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  location?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  walletAddress: string | undefined;
  refreshToken: () => Promise<boolean>;
  error: string | null;
}