import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getSettings } from "../../services/apiSettings";

// export function useSettings() {
//   const {
//     isLoading,
//     error,
//     data: settings,
//   } = useQuery({
//     queryKey: ["settings"],
//     queryFn: getSettings,
//   });

//   return { isLoading, error, settings };
// }


export function useSettings() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const settings = data?.result ?? null;

  return { isLoading, error, settings };
}