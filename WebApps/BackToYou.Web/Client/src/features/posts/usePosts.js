import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../../services/apiPost";

export function usePosts(){
  const {
    isPending,
    data: posts,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  })

  return {isPending, error, posts}
}