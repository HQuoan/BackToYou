import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { resetPassword as resetPasswordAPI } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useResetPassword() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: resetPasswordAPI,
    onSuccess: () => {
      toast.success("Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại!")
      queryClient.removeQueries();
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { resetPassword, isPending };
}