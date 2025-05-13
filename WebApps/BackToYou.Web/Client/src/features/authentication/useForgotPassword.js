import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { forgotPassword as forgotPasswordAPI } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useForgotPassword() {
  const navigate = useNavigate();

  const { mutate: forgotPassword, isPending } = useMutation({
    mutationFn: forgotPasswordAPI,
    onSuccess: () => {
      toast.success("Vui lòng kiểm tra email để lấy lại mật khẩu!");
      navigate("/reset-password");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { forgotPassword, isPending };
}