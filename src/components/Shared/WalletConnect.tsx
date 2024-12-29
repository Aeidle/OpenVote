import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { isMetaMaskInstalled } from '../../utils/metamask';

const WalletConnect = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await login();
    } catch (error: any) {
      console.error('Connection error:', error);
      if (error.message.includes('not registered')) {
        router.push('/signup');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    logout();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Don't render anything until after mounting to prevent hydration errors
  if (!mounted) return null;

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-blue-200">
            {formatAddress(user.walletAddress)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (!isMetaMaskInstalled()) {
    return (
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Install MetaMask
      </a>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className={`bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors
        ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
      `}
    >
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Connecting...</span>
        </span>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
};

export default WalletConnect;