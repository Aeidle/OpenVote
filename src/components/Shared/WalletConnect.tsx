import { useState } from 'react';

const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mockAddress = '0x1234...5678';

  const handleConnect = async () => {
    setIsLoading(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">
          {mockAddress}
        </span>
        <button
          onClick={handleDisconnect}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Disconnect
        </button>
      </div>
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