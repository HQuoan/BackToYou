import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getPostsByCategory } from "../../services/apiPost";
import toast from "react-hot-toast";

export function usePostsByCategory() {
  const [searchParams] = useSearchParams();

  const numDays = Number(searchParams.get("last")) || 7;

  const { isLoading, data } = useQuery({
    queryFn: () => getPostsByCategory(numDays),
    queryKey: ["posts", `category-last-${numDays}`],
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const posts = data?.result ?? null;
  const pagination = data?.pagination ?? null;

  return { isLoading, posts, pagination };
}
