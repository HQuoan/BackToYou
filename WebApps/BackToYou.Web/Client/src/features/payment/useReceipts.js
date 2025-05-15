import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getMyReceipts } from "../../services/apiPayment";
import { useSearchParams } from "react-router-dom";

export function useReceipts(filter = {}) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // ===== PAGINATION =====

  const pageNumber = Number(searchParams.get("PageNumber")) || 1;
  let pageSize = Number(searchParams.get("PageSize")) || 5;

  const page = { pageNumber, pageSize };

  // ===== FILTER =====
  // const filter = {
  //   status: searchParams.get("Status"),
  // };

  const { isPending, data, error } = useQuery({
    queryKey: ["receipts", page, filter],
    queryFn: () => getMyReceipts({ page, filter }),
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const receipts = data?.result ?? [];
  const pagination = data?.pagination ?? null;

  // ===== PREFETCH NEXT & PREV PAGES =====
  const totalPages = pagination?.totalPages ?? 0;

  if (pageNumber < totalPages) {
    const nextPage = { pageNumber: pageNumber + 1, pageSize };
    queryClient.prefetchQuery({
      queryKey: ["receipts", nextPage, filter],
      queryFn: () => getMyReceipts({ page: nextPage, filter }),
    });
  }

   if (pageNumber > 1) {
      const prevPage = { pageNumber: pageNumber - 1, pageSize };
      queryClient.prefetchQuery({
        queryKey: ["receipts", prevPage, filter],
        queryFn: () => getMyReceipts({ page: prevPage, filter }),
      });
    }

  return { isPending, error, receipts, pagination };
}
