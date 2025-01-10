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
    queryKey: ["users"],
    queryFn: async () =>
      (await axios.get<{ data: User[] }>("/api/user")).data.data,
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
