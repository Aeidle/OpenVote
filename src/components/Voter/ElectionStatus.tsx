import { useState, useEffect } from 'react';

interface Election {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  totalVoters: number;
  votesCount: number;
}

const mockElections: Election[] = [
  {
    id: '1',
    name: 'Student Council Election 2024',
    startDate: '2024-03-01T09:00:00',
    endDate: '2024-03-02T17:00:00',
    status: 'upcoming',
    totalVoters: 5000,
    votesCount: 0,
  },
  {
    id: '2',
    name: 'Class Representative Election',
    startDate: '2024-02-15T08:00:00',
    endDate: '2024-02-15T16:00:00',
    status: 'ongoing',
    totalVoters: 300,
    votesCount: 145,
  },
  {
    id: '3',
    name: 'Department Head Election',
    startDate: '2024-01-10T10:00:00',
    endDate: '2024-01-10T18:00:00',
    status: 'completed',
    totalVoters: 150,
    votesCount: 142,
  },
];

const ElectionStatus = () => {
  const [elections, setElections] = useState<Election[]>(mockElections);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (selectedElection?.status === 'ongoing') {
      const timer = setInterval(() => {
        const end = new Date(selectedElection.endDate).getTime();
        const now = new Date().getTime();
        const distance = end - now;

        if (distance < 0) {
          clearInterval(timer);
          setTimeRemaining('Election has ended');
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedElection]);

  const getStatusBadgeClass = (status: Election['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Election Status</h2>

      {/* Elections List */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {elections.map((election) => (
          <div
            key={election.id}
            className={`
              border rounded-lg p-4 cursor-pointer transition-all duration-200
              ${
                selectedElection?.id === election.id
                  ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }
            `}
            onClick={() => setSelectedElection(election)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{election.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(election.startDate)} - {formatDate(election.endDate)}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                  election.status
                )}`}
              >
                {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Election Details */}
      {selectedElection && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{selectedElection.name}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Status Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium">{formatDate(selectedElection.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium">{formatDate(selectedElection.endDate)}</p>
                </div>
                {selectedElection.status === 'ongoing' && (
                  <div>
                    <p className="text-sm text-gray-600">Time Remaining</p>
                    <p className="font-medium text-blue-600">{timeRemaining}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Voter Statistics */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Voter Statistics</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Total Registered Voters</p>
                  <p className="font-medium">{selectedElection.totalVoters.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Votes Cast</p>
                  <p className="font-medium">{selectedElection.votesCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Voter Turnout</p>
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {((selectedElection.votesCount / selectedElection.totalVoters) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                      <div
                        style={{
                          width: `${(selectedElection.votesCount / selectedElection.totalVoters) * 100}%`,
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionStatus;