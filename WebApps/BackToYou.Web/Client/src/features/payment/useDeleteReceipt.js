import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteReceipt as deleteReceiptAPI } from "../../services/apiPayment";

export function useDeleteReceipt() {
  const queryClient = useQueryClient();

  const { mutate: deleteReceipt, isPending: isDeleting } = useMutation({
    mutationFn: deleteReceiptAPI,
    onSuccess: () => {
      toast.success("Xóa hóa đơn thành công");
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isDeleting, deleteReceipt };
}
