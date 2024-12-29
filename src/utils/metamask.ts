declare global {
  interface Window {
    ethereum?: any;
  }
}

export const isMetaMaskInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;
  return typeof window.ethereum !== 'undefined';
};

export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('Please install MetaMask');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  } catch (error) {
    throw new Error('User denied account access');
  }
};

export const signMessage = async (message: string, address: string) => {
  if (!isMetaMaskInstalled()) {
    throw new Error('Please install MetaMask');
  }

  try {
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    });
    return signature;
  } catch (error) {
    throw new Error('Signature failed');
  }
};
