import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateInfo as updateInfoAPI } from "../../services/apiUsers";

export function useUpdateInfo() {
  const queryClient = useQueryClient(); 

  const { mutate: updateInfo, isLoading } = useMutation({
    mutationFn: updateInfoAPI,
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isLoading, updateInfo };
}
