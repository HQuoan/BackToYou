import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyPosts } from "../../services/apiPosts";
import {useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export function useMyPosts(filter = {}) {
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
    queryKey: ["my-posts", page, filter],
    queryFn: () => getMyPosts({ page, filter }),
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
      queryKey: ["my-posts", nextPage, filter],
      queryFn: () => getMyPosts({ page: nextPage, filter }),
    });
  }

  if (pageNumber > 1) {
    const prevPage = { pageNumber: pageNumber - 1, pageSize };
    queryClient.prefetchQuery({
      queryKey: ["my-posts", prevPage, filter],
      queryFn: () => getMyPosts({ page: prevPage, filter }),
    });
  }

  return { isPending, error, posts, pagination };
}

