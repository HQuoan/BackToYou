import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePost as deletePostAPI } from "../../services/apiPosts";

export function useDeletePost() {
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: deletePostAPI,
    onSuccess: () => {
      toast.success("Xóa bài viết thành công");
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isDeleting, deletePost };
}
