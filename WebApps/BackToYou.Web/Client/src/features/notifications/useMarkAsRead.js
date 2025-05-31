import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { markAsRead  as markAsReadAPI} from "../../services/apiNotification";

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  const { mutate: markAsRead, isPending } = useMutation({
    mutationFn: markAsReadAPI,
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isPending, markAsRead };
}
