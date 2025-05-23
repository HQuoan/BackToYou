import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getReport } from "../../services/apiReports";

export function useReport(id) {
  const { isLoading, data } = useQuery({
    queryKey: ["report", id],
    queryFn: () => getReport(id),
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const report = data?.result ?? null;

  return { isLoading, report };
}
