import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteReport as deleteReportAPI } from "../../services/apiReports";

export function useDeleteReport() {
  const queryClient = useQueryClient();

  const { mutate: deleteReport, isLoading } = useMutation({
    mutationFn: deleteReportAPI,
    onSuccess: () => {
      toast.success("Đã xóa báo cáo thành công.");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isLoading, deleteReport };
}
