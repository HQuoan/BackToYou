import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { uploadAvatar as uploadAvatarAPI } from "../../services/apiUsers";

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  
  const { mutateAsync: uploadAvatar, isLoading } = useMutation({
    mutationFn: uploadAvatarAPI,
    onSuccess: () => {
      toast.success("Tải ảnh thành công");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err) => {
      toast.error(err.message || "Tải ảnh thất bại");
    },
  });

  return { uploadAvatar, isLoading };
}
