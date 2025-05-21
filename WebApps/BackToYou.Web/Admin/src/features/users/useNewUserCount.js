import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getNewUserCount } from "../../services/apiUsers";

export function useNewUserCount() {
  const [searchParams] = useSearchParams();

  const numDays = Number(searchParams.get("last")) || 7;

  const { isLoading, data } = useQuery({
    queryFn: () => getNewUserCount(numDays),
    queryKey: ["user-count", `payment-last-${numDays}`],
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { userCount } = data ?? { userCount: 0 };

  return { isLoading, userCount };
}
