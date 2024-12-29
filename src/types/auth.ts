export type Role = 'admin' | 'voter' | 'candidate';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  walletAddress: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null;
}

export interface SignUpData {
  name: string;
  email: string;
  role: Role;
  walletAddress: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
