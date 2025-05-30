import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { upgradePriorityPost as upgradePriorityPostAPI } from "../../services/apiPosts";

export function useUpgradePriorityPost() {
  const queryClient = useQueryClient();

  const { mutate: upgradePriorityPost, isPending: isUpgrading } = useMutation({
    mutationFn: upgradePriorityPostAPI,
    onSuccess: () => {
      toast.success("Nâng cấp bài viết thành công.");
      queryClient.invalidateQueries("my-posts");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isUpgrading, upgradePriorityPost };
}
