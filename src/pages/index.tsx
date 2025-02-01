import { withAuth } from "@/lib/auth";

const Index: React.FC = () => {
  return <div className="text-center text-black">Dashboard main</div>;
};

export default Index;

export const getServerSideProps = withAuth();
