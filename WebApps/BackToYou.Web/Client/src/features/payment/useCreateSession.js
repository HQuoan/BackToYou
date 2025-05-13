import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession as createSessionAPI } from "../../services/apiPayment";
import toast from "react-hot-toast";

export function useCreateSession() {
  const queryClient = useQueryClient();

  const { mutate: createSession, isPending: isCreating } = useMutation({
    mutationFn: createSessionAPI,
    onSuccess: () => {
      toast.success("Tạo hóa đơn thành công");
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isCreating, createSession };
}
