import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateReportStatus as updateReportStatusAPI } from "../../services/apiReports";

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: updateReportStatus } = useMutation({
    mutationFn: updateReportStatusAPI,
    onSuccess: () => {
      toast.success("Cập nhật trạng thái báo cáo thành công");
      queryClient.invalidateQueries({ queryKey: ["report"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { isLoading, updateReportStatus };
}
