import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isFollower } from "../../services/apiFollowers";

export function useIsFollower(postId, enabled = true) {
  const { isPending, data, error } = useQuery({
    queryKey: ["follower"],
    queryFn: () => isFollower(postId),
    enabled,
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const follower = data?.result ?? null;

  return { isPending, error, follower };
}
