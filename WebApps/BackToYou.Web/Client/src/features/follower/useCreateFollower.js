import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createFollower as createFollowerAPI } from "../../services/apiFollowers";

export function useCreateFollower() {
  const queryClient = useQueryClient();

  const { mutate: createFollower, isPending: isCreating } = useMutation({
    mutationFn: createFollowerAPI,
    onSuccess: () => {
      toast.success("Đã theo dõi bài viết");
      queryClient.invalidateQueries({ queryKey: ["follower"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isCreating, createFollower };
}
