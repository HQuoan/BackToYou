import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { changePassword as changePasswordAPI } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useChangePassword() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: changePassword, isLoading } = useMutation({
    mutationFn: changePasswordAPI,
    onSuccess: () => {
      toast.success("Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại!")
      queryClient.removeQueries();
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { changePassword, isLoading };
}