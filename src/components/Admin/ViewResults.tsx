import { useState } from 'react';

interface ElectionResult {
  id: string;
  candidateName: string;
  party: string;
  voteCount: number;
  percentage: number;
}

const mockResults: ElectionResult[] = [
  { id: '1', candidateName: 'John Doe', party: 'Progressive Party', voteCount: 1250, percentage: 45.5 },
  { id: '2', candidateName: 'Jane Smith', party: 'Conservative Union', voteCount: 980, percentage: 35.6 },
  { id: '3', candidateName: 'Bob Johnson', party: 'Independent', voteCount: 420, percentage: 15.3 },
  { id: '4', candidateName: 'Alice Brown', party: 'Green Alliance', voteCount: 98, percentage: 3.6 },
];

const ViewResults = () => {
  const [results] = useState<ElectionResult[]>(mockResults);
  const totalVotes = results.reduce((sum, result) => sum + result.voteCount, 0);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Election Results</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-blue-800 text-sm font-medium">Total Votes Cast</h3>
          <p className="text-2xl font-bold text-blue-900">{totalVotes.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-green-800 text-sm font-medium">Leading Candidate</h3>
          <p className="text-2xl font-bold text-green-900">{results[0].candidateName}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-purple-800 text-sm font-medium">Voter Turnout</h3>
          <p className="text-2xl font-bold text-purple-900">78.5%</p>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Candidate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Party
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Votes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, index) => (
              <tr key={result.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{index + 1}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{result.candidateName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{result.party}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{result.voteCount.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-grow">
                      <div className="relative h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-blue-600 transition-all duration-500 ease-in-out"
                          style={{ width: `${result.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {result.percentage}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Download Results Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => alert('Downloading results...')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download Results
        </button>
      </div>
    </div>
  );
};

export default ViewResults;