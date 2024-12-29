// This simulates a database of registered voter IDs
// In a real application, this would be in a secure database
interface VoterRecord {
  voterId: string;
  isRegistered: boolean;
  hasLinkedWallet: boolean;
}

export const voterDatabase: VoterRecord[] = [
  {
    voterId: "VOT2024001",
    isRegistered: true,
    hasLinkedWallet: false
  },
  {
    voterId: "VOT2024002",
    isRegistered: true,
    hasLinkedWallet: false
  },
  {
    voterId: "VOT2024003",
    isRegistered: true,
    hasLinkedWallet: false
  },
  {
    voterId: "VOT2024004",
    isRegistered: false, // Example of an invalid voter ID
    hasLinkedWallet: false
  }
];

export const verifyVoterId = (voterId: string): boolean => {
  const voter = voterDatabase.find(v => v.voterId === voterId);
  return voter?.isRegistered ?? false;
};

export const linkWalletToVoterId = (voterId: string): boolean => {
  const voterIndex = voterDatabase.findIndex(v => v.voterId === voterId);
  if (voterIndex === -1 || !voterDatabase[voterIndex].isRegistered) {
    return false;
  }
  
  if (voterDatabase[voterIndex].hasLinkedWallet) {
    return false; // Voter ID already has a linked wallet
  }

  voterDatabase[voterIndex].hasLinkedWallet = true;
  return true;
};
