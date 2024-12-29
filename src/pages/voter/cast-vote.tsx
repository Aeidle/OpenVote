import Layout from '@/components/Shared/Layout';
import CastVote from '@/components/Voter/CastVote';

const CastVotePage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Cast Your Vote</h1>
        </div>
        <CastVote />
      </div>
    </Layout>
  );
};

export default CastVotePage;
