import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getPostSettings } from "../../services/apiPostSettings";

export function usePostSettings() {
  const { isPending, data, error } = useQuery({
    queryKey: ["post-settings"],
    queryFn: () => getPostSettings(),
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const postSettings = data?.result ?? null;

  return { isPending, error, postSettings };
}
