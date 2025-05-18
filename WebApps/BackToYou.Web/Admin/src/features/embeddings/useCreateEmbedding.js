import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createEmbedding as createEmbeddingAPI } from "../../services/apiEmbedding";

export function useCreateEmbedding() {
  const queryClient = useQueryClient();

  const { mutate: createEmbedding, isLoading } = useMutation({
    mutationFn: createEmbeddingAPI,
    onSuccess: () => {
      toast.success("Trích xuất đặc trưng ảnh bài viết thành công");
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isLoading, createEmbedding };
}
