import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { connectWallet } from '../utils/metamask';

export default function SignUp() {
  const [voterId, setVoterId] = useState('');
  const [error, setError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const verifyVoterAndSignup = async (walletAddress: string) => {
    try {
      const response = await fetch('/api/verify-voter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voterId,
          walletAddress,
        }),
      });

      const data = await response.json();

      if (!data.allowed) {
        throw new Error(data.error || 'Voter verification failed');
      }

      // If voter is verified, proceed with anonymous signup
      await signup('Anonymous Voter', `voter-${voterId}@anonymous.com`, 'voter');
      router.push('/');
    } catch (error: any) {
      throw new Error(error.message || 'Verification failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsConnecting(true);

    try {
      // First connect the wallet
      const walletAddress = await connectWallet();
      // Then verify voter and signup
      await verifyVoterAndSignup(walletAddress);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register to Vote
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in with your wallet
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="voterId" className="sr-only">
                Voter ID
              </label>
              <input
                id="voterId"
                name="voterId"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your Voter ID (e.g., VOT2024001)"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isConnecting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isConnecting ? 'Verifying...' : 'Verify and Connect Wallet'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Important Information
              </span>
            </div>
          </div>
          <div className="mt-6">
            <div className="text-sm text-gray-500">
              <ul className="list-disc list-inside space-y-2">
                <li>Your voter ID must be pre-registered in the system</li>
                <li>Each voter ID can only be linked to one wallet address</li>
                <li>Your identity remains anonymous throughout the voting process</li>
                <li>Keep your voter ID private and secure</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
