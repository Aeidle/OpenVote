declare global {
  interface Window {
    ethereum?: any;
  }
}

export const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } catch (error) {
      throw new Error('User denied account access');
    }
  } else {
    throw new Error('Please install MetaMask');
  }
};

export const signMessage = async (message: string, address: string) => {
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
