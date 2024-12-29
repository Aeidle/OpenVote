import { useState } from 'react';

interface Candidate {
  id: string;
  name: string;
  party: string;
  manifesto: string;
  imageUrl: string;
}

const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'John Doe',
    party: 'Progressive Party',
    manifesto: 'Building a better future through innovation and sustainable development.',
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    name: 'Jane Smith',
    party: 'Conservative Union',
    manifesto: 'Preserving traditional values while embracing economic growth.',
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    party: 'Independent',
    manifesto: 'Bringing fresh perspectives and balanced solutions to governance.',
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: '4',
    name: 'Alice Brown',
    party: 'Green Alliance',
    manifesto: 'Promoting environmental sustainability and social justice.',
    imageUrl: 'https://via.placeholder.com/150',
  },
];

const CastVote = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVoteSubmit = async () => {
    setIsSubmitting(true);

    // Simulate blockchain transaction
    setTimeout(() => {
      console.log('Vote cast for candidate:', selectedCandidate);
      setIsSubmitting(false);
      setHasVoted(true);
      setShowConfirmation(false);
    }, 2000);
  };

  if (hasVoted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="text-center py-8">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You for Voting!</h2>
          <p className="text-gray-600">
            Your vote has been securely recorded on the blockchain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cast Your Vote</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className={`
              border rounded-lg p-4 cursor-pointer transition-all duration-200
              ${
                selectedCandidate === candidate.id
                  ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }
            `}
            onClick={() => setSelectedCandidate(candidate.id)}
          >
            <div className="flex items-center space-x-4">
              <img
                src={candidate.imageUrl}
                alt={candidate.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{candidate.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{candidate.party}</p>
                <p className="text-sm text-gray-500">{candidate.manifesto}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setShowConfirmation(true)}
          disabled={!selectedCandidate || isSubmitting}
          className={`
            px-6 py-2 bg-blue-600 text-white rounded-lg font-medium
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-colors
            ${(!selectedCandidate || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          Cast Vote
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Your Vote</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cast your vote for{' '}
              <span className="font-semibold">
                {mockCandidates.find(c => c.id === selectedCandidate)?.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleVoteSubmit}
                disabled={isSubmitting}
                className={`
                  px-4 py-2 bg-blue-600 text-white rounded-lg font-medium
                  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition-colors
                  ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Confirming...
                  </span>
                ) : (
                  'Confirm Vote'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CastVote;