import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { aiSearch as aiSearchAPI } from "../../services/apiAI";

export function useAiSearch(){
  const {mutateAsync: aiSearch, isPending} = useMutation({
    mutationFn: aiSearchAPI,
    onError: (err) => toast.error(err.message),
  });

  return { isPending, aiSearch };
}