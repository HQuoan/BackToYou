// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { validateSession as validateSessionAPI } from "../../services/apiPayment";

// export function useValidateSession() {
//   const queryClient = useQueryClient();
//   const { mutate: validateSession, isPending } = useMutation({
//     mutationFn: validateSessionAPI,
//     onSuccess: () => {
//       toast.success("Thanh toán thành công");
//       queryClient.invalidateQueries({ queryKey: ["receipts"] });
//     },
//     onError: (error) => {
//       toast.error(error.message);
//     },
//     retry: 0,
//   });

//   return { isPending, validateSession };
// }

import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { validateSession as validateSessionAPI } from "../../services/apiPayment";

export function useValidateSession() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: validateSessionAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
    retry: 0,
  });

  const validateSession = useCallback(
    async (receiptId) => {
      await toast.promise(mutateAsync(receiptId), {
        loading: "Đang xác thực thanh toán...",
        success: "Thanh toán thành công",
        error: (err) => err.message || "Xác thực thất bại",
      });
    },
    [mutateAsync]
  );

  return { isPending, validateSession };
}

