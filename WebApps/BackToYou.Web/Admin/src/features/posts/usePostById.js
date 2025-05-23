import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../../services/apiPost";
import toast from "react-hot-toast";

export function usePostById(postId, enabled = true) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId && enabled,
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const post = data?.result ?? null;

  return { isLoading, error, post };
}
