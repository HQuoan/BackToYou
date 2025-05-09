import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/apiCategories";

export function useCategories() {
  const {
    isPending,
    data,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const categories = data?.result ?? [];

  return { isPending, error, categories };
}
