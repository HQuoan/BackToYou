import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../services/apiUsers";

export function useUser() {
  const { isPending, data, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getMe(),
  });

  const profile = data?.result ?? [];

  return { isPending, error, profile };
}