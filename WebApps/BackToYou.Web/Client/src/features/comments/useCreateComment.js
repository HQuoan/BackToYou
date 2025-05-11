import { useMutation } from "@tanstack/react-query";
import { createComment as createCommentAPI } from "../../services/apiComments";
import toast from "react-hot-toast";

export function useCreateComment() {
  const { mutate: createComment, isPending: isCreating } = useMutation({
    mutationFn: createCommentAPI,
    onSuccess: () => {
      toast.success("Tạo bình luận thành công");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isCreating, createComment };
}
