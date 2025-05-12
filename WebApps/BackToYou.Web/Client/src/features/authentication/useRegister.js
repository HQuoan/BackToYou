import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { register as registerAPI } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useRegister() {
  const navigate = useNavigate();

  const { isPending, mutate: register } = useMutation({
    mutationFn: registerAPI,
    onSuccess: () => {
      toast.success("Đăng ký tài khoản thành công!");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isPending, register };
}