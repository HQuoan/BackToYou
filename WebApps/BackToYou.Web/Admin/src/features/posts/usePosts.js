import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPosts, getPostsWithUsers } from "../../services/apiPost";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PAGE_SIZE } from "../../utils/constants";

export function usePosts() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // ===== PAGINATION =====
  let pageNumber = Number(searchParams.get("page")) || 1;
  const pageSize = PAGE_SIZE;

  const page = { pageNumber, pageSize };

  // ===== FILTER =====

  const postStatus = searchParams.get("status");
  const postLabel = searchParams.get("label");
  const userEmail = searchParams.get("email");

  const filter = {
    orderBy: searchParams.get("sortBy") || undefined,
    postStatus: !postStatus || postStatus === "all" ? null : postStatus,
    postLabel: !postLabel || postLabel === "all" ? null : postLabel,
    userEmail: !userEmail ? null : userEmail,
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["posts", page, filter],
    queryFn: () => getPostsWithUsers({ page, filter }),
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
      queryFn: () => getPostsWithUsers({ page: nextPage, filter }),
    });
  }

  if (pageNumber > 1) {
    const prevPage = { pageNumber: pageNumber - 1, pageSize };
    queryClient.prefetchQuery({
      queryKey: ["posts", prevPage, filter],
      queryFn: () => getPostsWithUsers({ page: prevPage, filter }),
    });
  }

  return { isLoading, error, posts, pagination };
}
