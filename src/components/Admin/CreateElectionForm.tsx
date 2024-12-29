import { useState } from 'react';

interface Candidate {
  name: string;
  party: string;
}

interface FormData {
  electionName: string;
  description: string;
  startDate: string;
  endDate: string;
  candidates: Candidate[];
}

const CreateElectionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    electionName: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: [{ name: '', party: '' }],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCandidateChange = (index: number, field: keyof Candidate, value: string) => {
    const newCandidates = [...formData.candidates];
    newCandidates[index] = {
      ...newCandidates[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      candidates: newCandidates
    }));
  };

  const addCandidate = () => {
    setFormData(prev => ({
      ...prev,
      candidates: [...prev.candidates, { name: '', party: '' }]
    }));
  };

  const removeCandidate = (index: number) => {
    if (formData.candidates.length > 1) {
      setFormData(prev => ({
        ...prev,
        candidates: prev.candidates.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      alert('Election created successfully!');
      setIsSubmitting(false);
      
      // Reset form
      setFormData({
        electionName: '',
        description: '',
        startDate: '',
        endDate: '',
        candidates: [{ name: '', party: '' }],
      });
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Election</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Election Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Election Name
          </label>
          <input
            type="text"
            name="electionName"
            value={formData.electionName}
            onChange={handleInputChange}
            placeholder="e.g., Student Council Election 2024"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide details about the election..."
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Candidates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Candidates
          </label>
          <div className="space-y-4">
            {formData.candidates.map((candidate, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={candidate.name}
                  onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Party/Affiliation"
                  value={candidate.party}
                  onChange={(e) => handleCandidateChange(index, 'party', e.target.value)}
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.candidates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCandidate(index)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addCandidate}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Candidate
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              px-6 py-2 bg-blue-600 text-white rounded-lg font-medium
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
                Creating...
              </span>
            ) : (
              'Create Election'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateElectionForm;