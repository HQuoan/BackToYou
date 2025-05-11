import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getComments } from "../../services/apiComments";
import toast from "react-hot-toast";

export function useComments(postId, pageNumber = 1) {
  const queryClient = useQueryClient();
  const pageSize = 6;

  const page = { pageNumber, pageSize };

  const { isPending, data, error } = useQuery({
    queryKey: ["comments", postId, pageNumber],
    queryFn: () => getComments({ page, postId }),
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const comments = data?.result ?? [];
  const pagination = data?.pagination ?? null;

  // ===== PREFETCH NEXT & PREV PAGES =====
  const totalPages = pagination?.totalPages ?? 0;
  if (pageNumber < totalPages) {
    const nextPage = { pageNumber: pageNumber + 1, pageSize };
    queryClient.prefetchQuery({
      queryKey: ["comments", postId, pageNumber + 1],
      queryFn: () => getComments({ page: nextPage, postId }),
    });
  }

  return { isPending, error, comments, pagination };
}
