import Layout from '@/components/Shared/Layout';
import ViewResults from '@/components/Admin/ViewResults';

const ViewResultsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Election Results</h1>
        </div>
        <ViewResults />
      </div>
    </Layout>
  );
};

export default ViewResultsPage;
