import Layout from '@/components/Shared/Layout';
import Register from '@/components/Voter/Register';

const VoterRegistrationPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Voter Registration</h1>
        </div>
        <Register />
      </div>
    </Layout>
  );
};

export default VoterRegistrationPage;
