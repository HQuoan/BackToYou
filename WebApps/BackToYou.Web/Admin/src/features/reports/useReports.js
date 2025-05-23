import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";
import { getReports } from "../../services/apiReports";

export function useReports() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // ===== PAGINATION =====
  let pageNumber = Number(searchParams.get("page")) || 1;
  const pageSize = PAGE_SIZE;

  const page = { pageNumber, pageSize };

  // ===== FILTER =====

  const status = searchParams.get("status");
  const title = searchParams.get("title");
  const userEmail = searchParams.get("email");

  const filter = {
    orderBy: searchParams.get("sortBy") || undefined,
    status: !status || status === "all" ? null : status,
    title: !title || title === "all" ? null : title,
    userEmail: !userEmail ? null : userEmail,
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["reports", page, filter],
    queryFn: () => getReports({ page, filter }),
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const reports = data?.result ?? [];
  const pagination = data?.pagination ?? null;

  // ===== PREFETCH NEXT & PREV PAGES =====
  const totalPages = pagination?.totalPages ?? 0;

  if (pageNumber < totalPages) {
    const nextPage = { pageNumber: pageNumber + 1, pageSize };
    queryClient.prefetchQuery({
      queryKey: ["reports", nextPage, filter],
      queryFn: () => getReports({ page: nextPage, filter }),
    });
  }

  if (pageNumber > 1) {
    const prevPage = { pageNumber: pageNumber - 1, pageSize };
    queryClient.prefetchQuery({
      queryKey: ["reports", prevPage, filter],
      queryFn: () => getReports({ page: prevPage, filter }),
    });
  }

  return { isLoading, error, reports, pagination };
}
