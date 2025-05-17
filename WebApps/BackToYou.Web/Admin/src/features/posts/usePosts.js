import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPosts } from "../../services/apiPost";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PAGE_SIZE } from "../../utils/constants";

export function usePosts() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // ===== PAGINATION =====
  const pageNumber = Number(searchParams.get("page")) || 1;
  const pageSize = PAGE_SIZE;


  const page = { pageNumber, pageSize };

  // ===== FILTER =====

  const postStatusValue = searchParams.get("status");

  const filter = {
    orderBy: searchParams.get("sortBy") || undefined,
    postStatus: !postStatusValue || postStatusValue === "all" ? null : postStatusValue,
  };



  const {
    isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["posts", page, filter],
    queryFn: () => getPosts({ page, filter }),
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
      queryKey: ["posts", nextPage, filter],
      queryFn: () => getPosts({ page: nextPage, filter }),
    });
  }

  if (pageNumber > 1) {
    const prevPage = { pageNumber: pageNumber - 1, pageSize };
    queryClient.prefetchQuery({
      queryKey: ["posts", prevPage, filter],
      queryFn: () => getPosts({ page: prevPage, filter }),
    });
  }

  return { isLoading, error, posts, pagination };
}

