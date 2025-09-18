import { ExtendedAuthContextType } from './AuthProvider';
import { createContext } from 'react';

export const AuthContext = createContext<ExtendedAuthContextType | undefined>(undefined);