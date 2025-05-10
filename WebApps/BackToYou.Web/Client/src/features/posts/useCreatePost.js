// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createPost as createPostAPI } from "../../services/apiPost";
// import toast from "react-hot-toast";

// export function useCreatePost(){
//   const queryClient = useQueryClient();

//   const {mutate: createPost, isPending: isCreating, error} = useMutation({
//     mutationFn: createPostAPI,
//     onSuccess: () => {
//       toast.success("Tạo bài đăng thành công");
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//     },
//     // onError: (err) => toast.error('dfsd'),
//   })

//   return {isCreating, createPost, error}
// }

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost as createPostAPI } from "../../services/apiPost";
import toast from "react-hot-toast";

export function useCreatePost() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createPost,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: createPostAPI,
    onError: (err) => toast.error(err.message),
  });

  const handleCreatePost = async (data) => {
    const result = await createPost(data);
    toast.success("Tạo bài đăng thành công");
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    return result?.result;
  };

  return { isCreating, createPost: handleCreatePost, error };
}

