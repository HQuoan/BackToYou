import { useQuery } from "@tanstack/react-query";
import { getPostBySlug } from "../../services/apiPost";
import toast from "react-hot-toast";

export function usePost(slug) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const post = data?.result ?? null;

  return { isLoading, error, post };
}

