import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/apiCategories";
import toast from "react-hot-toast";

// export function useCategories() {
//   const {
//     isPending,
//     data,
//     error,
//   } = useQuery({
//     queryKey: ["categories"],
//     queryFn: () => getCategories(),
//   });

//   const categories = data?.result ?? [];

//   return { isPending, error, categories };
// }

export function useCategories() {
  const {
    isPending,
    data,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const categories = data?.result ?? [];

  return { isPending, error, categories };
}