import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { assignRole as assignRoleAPI } from "../../services/apiAuth";

export function useAssignRole() {
  const queryClient = useQueryClient();

  const { mutate: assignRole, isLoading } = useMutation({
    mutationFn: assignRoleAPI,
    onSuccess: () => {
      toast.success("Cập nhật quyền hạn tài khoản thành công!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isLoading, assignRole };
}
