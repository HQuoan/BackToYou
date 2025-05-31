import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getMyNotifications } from "../../services/apiNotification";

export function useMyNotifications(pageNumber = 1, filter = {}) {
  const queryClient = useQueryClient();

  // ===== PAGINATION =====
  const pageSize = 6;

  const page = { pageNumber, pageSize };

  const { isPending, data, error } = useQuery({
    queryKey: ["my-notifications", page, filter],
    queryFn: () => getMyNotifications({ page, filter }),
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const notifications = data?.result ?? [];
  const pagination = data?.pagination ?? null;

  // ===== PREFETCH NEXT & PREV PAGES =====
  const totalPages = pagination?.totalPages ?? 0;

  if (pageNumber < totalPages) {
    const nextPage = { pageNumber: pageNumber + 1, pageSize };
    queryClient.prefetchQuery({
      queryKey: ["my-notifications", nextPage, filter],
      queryFn: () => getMyNotifications({ page: nextPage, filter }),
    });
  }

  return { isPending, error, notifications, pagination };
}
