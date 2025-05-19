import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getPostPriorityPrice } from "../../services/apiPostSettings";

export function usePostPriorityPrice() {
  const { isPending, data, error } = useQuery({
    queryKey: ["post-priority-price",],
    queryFn: () => getPostPriorityPrice(),
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const price = data?.result ?? null;

  return { isPending, error, price };
}

