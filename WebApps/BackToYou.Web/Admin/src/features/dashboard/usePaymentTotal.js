import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getPaymentTotal } from "../../services/apiPayment";

export function usePaymentTotal() {
  const [searchParams] = useSearchParams();

  const numDays = Number(searchParams.get("last")) || 7;

  const { isLoading, data } = useQuery({
    queryFn: () => getPaymentTotal(numDays),
    queryKey: ["payment-total", `payment-last-${numDays}`],
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const paymentTotal = data?.result ?? null;
  const pagination = data?.pagination ?? null;

  return { isLoading, paymentTotal, pagination };
}
