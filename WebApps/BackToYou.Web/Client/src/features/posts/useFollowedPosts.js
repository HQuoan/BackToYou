import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFollowedPosts } from "../../services/apiPosts";
import {useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export function useFollowedPosts() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // ===== PAGINATION =====
  const pageNumber = Number(searchParams.get("PageNumber")) || 1;
  let pageSize = Number(searchParams.get("PageSize")) || 5;

  const page = { pageNumber, pageSize };


  const {
    isPending,
    data,
    error,
  } = useQuery({
    queryKey: ["followed-posts", page],
    queryFn: () => getFollowedPosts({ page }),
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const posts = data?.result ?? [];
  const pagination = data?.pagination ?? null;

  // ===== PREFETCH NEXT & PREV PAGES =====
  const totalPages = pagination?.totalPages ?? 0;

  if (pageNumber < totalPages) {
    const nextPage = { pageNumber: pageNumber + 1, pageSize };
    queryClient.prefetchQuery({
      queryKey: ["followed-posts", nextPage],
      queryFn: () => getFollowedPosts({ page: nextPage }),
    });
  }

  if (pageNumber > 1) {
    const prevPage = { pageNumber: pageNumber - 1, pageSize };
    queryClient.prefetchQuery({
      queryKey: ["followed-posts", prevPage],
      queryFn: () => getFollowedPosts({ page: prevPage }),
    });
  }

  return { isPending, error, posts, pagination };
}

