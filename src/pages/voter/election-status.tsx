import Layout from '@/components/Shared/Layout';
import ElectionStatus from '@/components/Voter/ElectionStatus';

const ElectionStatusPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Election Status</h1>
        </div>
        <ElectionStatus />
      </div>
    </Layout>
  );
};

export default ElectionStatusPage;
