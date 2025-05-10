import { useQuery } from "@tanstack/react-query";
import { getPostBySlug } from "../../services/apiPost";

export function usePost(slug, enabled = true) {
  const { isPending, data, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
    enabled, // chỉ fetch khi enabled=true
  });

  const post = data?.result ?? null;

  return { isPending, error, post };
}
