import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getCommentById } from "../../services/apiComments";

export function useComment(id, enabled = true) {
  const { isPending, data, error } = useQuery({
    queryKey: ["comment", id],
    queryFn: () => getCommentById(id),
    enabled,
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const comment = data?.result ?? null;

  return { isPending, error, comment };
}
