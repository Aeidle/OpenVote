import Layout from '@/components/Shared/Layout';
import CreateElectionForm from '@/components/Admin/CreateElectionForm';

const CreateElectionPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create New Election</h1>
        </div>
        <CreateElectionForm />
      </div>
    </Layout>
  );
};

export default CreateElectionPage;
