import { useMutation, useQueryClient } from "@tanstack/react-query";
import {updatePostUpdateLabelAndStatus  as updatePostUpdateLabelAndStatusAPI} from "../../services/apiPost";
import toast from "react-hot-toast";


export function useUpdatePostUpdateLabelAndStatus() {
  const queryClient = useQueryClient();

  const {
    isLoading,
    mutate: updatePostUpdateLabelAndStatus,
  } = useMutation({
    mutationFn: updatePostUpdateLabelAndStatusAPI,
    onSuccess: () => {
      toast.success("Cập nhật trạng thái bài đăng thành công");
      queryClient.invalidateQueries({ queryKey:  ["post"]});
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { isLoading, updatePostUpdateLabelAndStatus };
}