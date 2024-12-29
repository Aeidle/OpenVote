import { NextApiRequest, NextApiResponse } from 'next';
import { verifyVoterId, linkWalletToVoterId } from '../../lib/voterDatabase';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { voterId, walletAddress } = req.body;

  if (!voterId || !walletAddress) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      allowed: false 
    });
  }

  // Verify the voter ID
  const isValidVoter = verifyVoterId(voterId);
  if (!isValidVoter) {
    return res.status(403).json({ 
      error: 'Invalid voter ID',
      allowed: false 
    });
  }

  // Try to link the wallet to the voter ID
  const linkSuccess = linkWalletToVoterId(voterId);
  if (!linkSuccess) {
    return res.status(403).json({ 
      error: 'Voter ID already has a linked wallet or is invalid',
      allowed: false 
    });
  }

  // If everything is successful, return allowed
  return res.status(200).json({ 
    allowed: true,
    message: 'Voter verified and wallet linked successfully'
  });
}
