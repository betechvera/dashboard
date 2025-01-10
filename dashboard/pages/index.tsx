import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface User {
  id: number;
  username: string;
  name?: string;
  last_name?: string;
  email: string;
  password?: string;
}

export default function Home() {
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () =>
      (await axios.get<{ data: User[] }>("/api/user")).data.data,
  });

  // console.log(users);

  return (
    <div>
      {users?.map((item: User) => (
        <div key={item.id}>{item.email}</div>
      ))}
    </div>
  );
}
