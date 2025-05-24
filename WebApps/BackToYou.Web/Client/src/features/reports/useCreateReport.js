import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createReport as createReportAPI  } from "../../services/apiReport";

export function useCreateReport() {
  const { mutate: createReport, isPending: isCreating } = useMutation({
    mutationFn: createReportAPI,
    onSuccess: () => {
      toast.success("Tạo báo cáo thành công");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isCreating, createReport };
}
