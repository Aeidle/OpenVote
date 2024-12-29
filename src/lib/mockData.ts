import { User } from '../types/auth';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    walletAddress: '0x1234567890123456789012345678901234567890'
  },
  {
    id: '2',
    name: 'Voter User',
    email: 'voter@example.com',
    role: 'voter',
    walletAddress: '0xBE9F173353187B538dc7F9905EaB058a7a5C2985'
  },
  {
    id: '3',
    name: 'Candidate User',
    email: 'candidate@example.com',
    role: 'candidate',
    walletAddress: '0x3456789012345678901234567890123456789012'
  },
];

export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email);
};

export const findUserByWalletAddress = (address: string): User | undefined => {
  return mockUsers.find(user => user.walletAddress.toLowerCase() === address.toLowerCase());
};

// Simulated JWT token generation
export const generateToken = (user: User): string => {
  return `mock_jwt_token_${user.id}_${Date.now()}`;
};
