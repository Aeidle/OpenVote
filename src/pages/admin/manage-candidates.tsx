import Layout from '@/components/Shared/Layout';
import ManageCandidates from '@/components/Admin/ManageCandidates';

const ManageCandidatesPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Candidates</h1>
        </div>
        <ManageCandidates />
      </div>
    </Layout>
  );
};

export default ManageCandidatesPage;
