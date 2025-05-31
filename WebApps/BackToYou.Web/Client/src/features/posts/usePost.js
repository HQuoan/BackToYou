import { useQuery } from "@tanstack/react-query";
import { getPostBySlug } from "../../services/apiPosts";
import toast from "react-hot-toast";

export function usePost(slug, enabled = true) {
  const { isPending, data, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
    enabled, // chỉ fetch khi enabled=true
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // useEffect(() => {
  //   if (error) toast.error(error.message);
  // }, [error]);

  const post = data?.result ?? null;

  return { isPending, error, post };
}
