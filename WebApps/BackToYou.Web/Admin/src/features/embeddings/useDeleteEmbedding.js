import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteEmbedding as deleteEmbeddingAPI } from "../../services/apiEmbedding";

export function useDeleteEmbedding() {
  const queryClient = useQueryClient();

  const { mutate: deleteEmbedding, isLoading } = useMutation({
    mutationFn: deleteEmbeddingAPI,
    onSuccess: () => {
      toast.success("Đã xóa dữ liệu đặc trưng ảnh của bài viết");
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isLoading, deleteEmbedding };
}
