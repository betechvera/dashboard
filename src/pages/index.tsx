import { User } from "@/models/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Home() {
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get<{ rows: User[] }>("/api/user");
      return response.data.rows;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      {users?.map((item: any) => (
        <div key={item.id}>{item.email}</div>
      ))}

      {process.env.NEXT_PUBLIC_SUPABASE_URL}
    </div>
  );
}
