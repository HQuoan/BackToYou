import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment as createCommentAPI} from "../../services/apiComments";
import toast from "react-hot-toast";

export function useCreateComment(){
  const queryClient = useQueryClient();

  const {mutate: createComment, isPending: isCreating} = useMutation({
    mutationFn: createCommentAPI,
    onSuccess: (data, variables) => {
      toast.success("Tạo bình luận thành công");
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
    },
    onError: (err) => toast.error(err.message),
  })

  return {isCreating, createComment}
}
