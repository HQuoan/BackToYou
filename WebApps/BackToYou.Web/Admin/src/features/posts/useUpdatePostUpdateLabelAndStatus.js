import { useMutation, useQueryClient } from "@tanstack/react-query";
import {updatePostUpdateLabelAndStatus  as updatePostUpdateLabelAndStatusAPI} from "../../services/apiPost";
import toast from "react-hot-toast";


export function useUpdatePostUpdateLabelAndStatus() {
  const queryClient = useQueryClient();

  const {
    isLoading,
    mutate: updatePostUpdateLabelAndStatus,
  } = useMutation({
    mutationFn: ({postId, postLabel, postStatus}) => updatePostUpdateLabelAndStatusAPI({postId, postLabel, postStatus}),
    onSuccess: (data) => {
      toast.success("Cập nhật trạng thái bài đăng thành công");
      queryClient.invalidateQueries({ queryKey:  ["post", data?.result?.slug]});
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { isLoading, updatePostUpdateLabelAndStatus };
}