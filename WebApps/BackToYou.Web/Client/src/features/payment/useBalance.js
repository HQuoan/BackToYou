import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getBalance } from "../../services/apiPayment";

export function useBalance() {

  const { isPending, data } = useQuery({
    queryKey: ["balance"],
    queryFn: () => getBalance(),
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const balance = data ?? 0;

  return { isPending, balance};
}
