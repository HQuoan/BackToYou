import { useQuery } from "@tanstack/react-query";
import { getUserBalanceWithEmail } from "../../services/apiPayment";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export function useUserBalance() {

  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");

  const { isLoading, data, error } = useQuery({
    queryKey: ["balance", email],
    queryFn: () => getUserBalanceWithEmail(email),
    enabled: !!email,
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const balance = data !== null ? [data] : [];


  return { isLoading, error, balance };
}

