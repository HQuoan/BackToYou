import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateFollower as updateFollowerAPI } from "../../services/apiFollowers";

export function useUpdateFollower() {
  const queryClient = useQueryClient();

  const { mutate: updateFollower, isPending: isUpdating } = useMutation({
    mutationFn: updateFollowerAPI,
    onSuccess: (data) => {
      const x = data?.result?.isSubscribed;
      if (x === true) {
        toast.success("Bạn sẽ nhận được tất cả thông báo.");
      } else {
        toast.success("Thông báo đã bị tắt cho bài viết này.");
      }

      queryClient.invalidateQueries({ queryKey: ["follower"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isUpdating, updateFollower };
}
