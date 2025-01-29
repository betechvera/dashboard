import { withAuth } from "@/lib/auth";
import { AuthenticatedUser } from "@/models";
import { User } from "@/models/user";
import { getAllUsers } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

interface HomeProps {
  user: AuthenticatedUser;
}

export default function Home({ user }: HomeProps) {
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getAllUsers({});
      return response.rows;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      name: {user.username}
      {users?.map((item: User) => (
        <div key={item.id}>{item.email}</div>
      ))}
      {process.env.NEXT_PUBLIC_SUPABASE_URL}
    </div>
  );
}

export const getServerSideProps = withAuth();
