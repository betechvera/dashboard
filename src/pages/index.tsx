import Layout from "@/components/Layout";
import { withAuth } from "@/lib/auth";

const Index: React.FC = () => {
  return <Layout>Olá, mundo!</Layout>;
};

export default Index;

export const getServerSideProps = withAuth();
