import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFollower as deleteFollowerAPI } from "../../services/apiFollowers";
import toast from "react-hot-toast";

export function useDeleteFollower() {
  const queryClient = useQueryClient();

  const { mutate: deleteFollower, isPending: isDeleting } = useMutation({
    mutationFn: deleteFollowerAPI,
    onSuccess: () => {
      toast.success("Hủy theo dõi thành công");
       queryClient.invalidateQueries({ queryKey: ["follower"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isDeleting, deleteFollower };
}
