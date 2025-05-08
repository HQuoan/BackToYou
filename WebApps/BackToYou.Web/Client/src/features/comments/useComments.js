import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getComments } from "../../services/apiComments";

export function useComments(postId) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // ===== PAGINATION =====
  const pageNumber = Number(searchParams.get("PageNumber")) || 1;
  let pageSize = Number(searchParams.get("PageSize")) || 6;

  const page = { pageNumber, pageSize };

  const {
    isPending,
    data,
    error,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments({ page, postId }),
    //keepPreviousData: true, // giữ lại data cũ khi chuyển trang để UX mượt hơn
  });

  const comments = data?.result ?? [];
  const pagination = data?.pagination ?? null;

  // ===== PREFETCH NEXT & PREV PAGES =====
  const totalPages = pagination?.totalPages ?? 0;

  if (pageNumber < totalPages) {
    const nextPage = { pageNumber: pageNumber + 1, pageSize };
    queryClient.prefetchQuery({
      queryKey: ["comments", postId],
      queryFn: () => getComments({ page: nextPage, postId }),
    });
  }

  if (pageNumber > 1) {
    const prevPage = { pageNumber: pageNumber - 1, pageSize };
    queryClient.prefetchQuery({
      queryKey: ["comments", postId],
      queryFn: () => getComments({ page: prevPage, postId }),
    });
  }

  return { isPending, error, comments, pagination };
}
