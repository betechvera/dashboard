import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface User {
  id: number;
  username: string;
  name: string | null;
  last_name?: string | null;
  email: string;
  password?: string;
}

export default function Home() {
  const { data: users = [] } = useQuery<User[]>({
    queryKey: [""],
    queryFn: async () => {
      const response = await axios.get<{ rows: User[] }>("/api/user");
      return response.data.rows;
    },
  });

  return (
    <div>
      {users?.map((item: User) => (
        <div key={item.id}>{item.email}</div>
      ))}

      {process.env.NEXT_PUBLIC_SUPABASE_URL}
    </div>
  );
}
