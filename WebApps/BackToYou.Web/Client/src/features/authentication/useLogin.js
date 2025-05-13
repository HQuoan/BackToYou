// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { LoginRequestDto } from "../../dtos/authDtos";
// import {
//   login as loginAPI,
//   loginWithFacebook as loginWithFacebookAPI,
//   loginWithGoogle as loginWithGoogleAPI,
// } from "../../services/apiAuth";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// export function useLogin() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const { isPending, mutate: login } = useMutation({
//     mutationFn: ({ email, password }) => {
//       const dto = new LoginRequestDto(email, password);
//       return loginAPI(dto);
//     },
//     onSuccess: (user) => {
//       toast.success("Đăng nhập thành công!"); 
//       queryClient.setQueryData(["user"], user)
//       navigate("/");
//     },
//   });

//   return { isPending, login };
// }

// export function useLoginWithGoogle() {
//   const navigate = useNavigate();

//   const { isPending, mutate: loginWithGoogle } = useMutation({
//     mutationFn: loginWithGoogleAPI,
//     onSuccess: () => {
//       toast.success("Đăng nhập thành công với Google!");
//       navigate("/");
//     },
//   });

//   return { isPending, loginWithGoogle };
// }

// export function useLoginWithFacebook() {
//   const navigate = useNavigate();

//   const { isPending, mutate: loginWithFacebook } = useMutation({
//     mutationFn: loginWithFacebookAPI ,
//     onSuccess: () => {
//       toast.success("Đăng nhập thành công với Facebook!");
//       navigate("/");
//     },
//   });

//   return { isPending, loginWithFacebook };
// }

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginRequestDto } from "../../dtos/authDtos";
import {
  login as loginAPI,
  loginWithFacebook as loginWithFacebookAPI,
  loginWithGoogle as loginWithGoogleAPI,
} from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isPending, mutate: login } = useMutation({
    mutationFn: ({ email, password }) => {
      const dto = new LoginRequestDto(email, password);
      return loginAPI(dto);
    },
    onSuccess: (user) => {
      toast.success("Đăng nhập thành công!");
      queryClient.setQueryData(["user"], user);
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isPending, login };
}

export function useLoginWithGoogle() {
  const navigate = useNavigate();

  const { isPending, mutate: loginWithGoogle } = useMutation({
    mutationFn: loginWithGoogleAPI,
    onSuccess: () => {
      toast.success("Đăng nhập thành công với Google!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isPending, loginWithGoogle };
}

export function useLoginWithFacebook() {
  const navigate = useNavigate();

  const { isPending, mutate: loginWithFacebook } = useMutation({
    mutationFn: loginWithFacebookAPI,
    onSuccess: () => {
      toast.success("Đăng nhập thành công với Facebook!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isPending, loginWithFacebook };
}

