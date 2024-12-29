import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, SignUpData } from '../types/auth';
import { findUserByWalletAddress, generateToken } from '../lib/mockData';
import { connectWallet, signMessage } from '../utils/metamask';

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, role: 'voter' | 'candidate' | 'admin') => Promise<void>;
  checkRole: (allowedRoles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_STATE: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  token: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(INITIAL_STATE);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check for stored auth data on mount
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const { user, token } = JSON.parse(storedAuth);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          loading: false,
        });
      } catch (error) {
        // If there's an error parsing the stored data, clear it
        localStorage.removeItem('auth');
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async () => {
    try {
      // Connect MetaMask
      const address = await connectWallet();
      
      // Find user by wallet address (simulating blockchain check)
      const user = findUserByWalletAddress(address);
      if (!user) {
        throw new Error('Wallet not registered. Please sign up first.');
      }

      // Sign message to verify wallet ownership
      const nonce = Math.floor(Math.random() * 1000000).toString();
      const message = `Sign this message to login to E-Voting System\nNonce: ${nonce}`;
      await signMessage(message, address);

      // Generate auth token (in real app, this would come from your backend)
      const token = generateToken(user);

      // Store auth data
      const authData = { user, token };
      localStorage.setItem('auth', JSON.stringify(authData));

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (name: string, email: string, role: 'voter' | 'candidate' | 'admin') => {
    try {
      // Connect MetaMask
      const address = await connectWallet();
      
      // Check if wallet is already registered (simulating blockchain check)
      const existingUser = findUserByWalletAddress(address);
      if (existingUser) {
        throw new Error('Wallet already registered. Please login instead.');
      }

      // Sign message to verify wallet ownership
      const nonce = Math.floor(Math.random() * 1000000).toString();
      const message = `Sign this message to register for E-Voting System\nNonce: ${nonce}`;
      await signMessage(message, address);

      // Create new user (in real app, this would be handled by your backend/blockchain)
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        role,
        walletAddress: address,
      };

      // Generate auth token
      const token = generateToken(newUser);

      // Store auth data
      const authData = { user: newUser, token };
      localStorage.setItem('auth', JSON.stringify(authData));

      setAuthState({
        user: newUser,
        token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth');
    }
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const checkRole = (allowedRoles: string[]): boolean => {
    return authState.user ? allowedRoles.includes(authState.user.role) : false;
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        signup,
        checkRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}