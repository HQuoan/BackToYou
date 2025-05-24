import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePost as deletePostAPI } from "../../services/apiPost";
import { useNavigate } from "react-router-dom";

export function useDeletePost() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: deletePostAPI,
    onSuccess: () => {
      toast.success("Xóa bài viết thành công");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/posts")
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isDeleting, deletePost };
}
