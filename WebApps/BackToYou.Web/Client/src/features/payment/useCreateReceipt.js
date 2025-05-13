import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createReceipt as createReceiptAPI } from "../../services/apiPayment";

export function useCreateReceipt() {
  const queryClient = useQueryClient();

  const { mutate: createReceipt, isPending: isCreating } = useMutation({
    mutationFn: createReceiptAPI,
    onSuccess: () => {
      // toast.success("Tạo hóa đơn thành công");
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isCreating, createReceipt };
}
