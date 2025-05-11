import { useMutation } from "@tanstack/react-query";
import { deleteComment as deleteCommentAPI } from "../../services/apiComments";
import toast from "react-hot-toast";

export function useDeleteComment() {
  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: deleteCommentAPI,
    onSuccess: () => {
      toast.success("Xóa bình luận thành công");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isDeleting, deleteComment };
}
