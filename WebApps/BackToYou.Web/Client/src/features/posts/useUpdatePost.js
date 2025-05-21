import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updatePost as updatePostAPI } from "../../services/apiPosts";

export function useUpdatePost() {
  const { mutate: updatePost, isPending: isUpdating } = useMutation({
    mutationFn: updatePostAPI,
    onSuccess: () => {
      toast.success("Đã cập nhật bài đăng");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isUpdating, updatePost };
}
