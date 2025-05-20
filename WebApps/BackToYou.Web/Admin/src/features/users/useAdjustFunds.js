import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { adjustFunds as adjustFundsAPI} from "../../services/apiPayment";

export function useAdjustFunds() {
  const queryClient = useQueryClient();

  const { mutate: adjustFunds, isLoading: isUpdating } = useMutation({
    mutationFn: adjustFundsAPI,
    onSuccess: () => {
      toast.success("Balance updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, adjustFunds };
}
