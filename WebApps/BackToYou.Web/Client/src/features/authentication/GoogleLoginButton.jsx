import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { loginWithGoogle } from "../../services/apiAuth";
import toast from "react-hot-toast";

function GoogleLoginButton() {

  const { isPending, mutate } = useMutation({
    mutationFn: (data) => {
      return loginWithGoogle(data);
    },
    onSuccess: (data) => {
      toast.success("Đăng nhập thành công!");
      console.log(data);
    },
    onError: (error) => {
      toast.error("Đăng nhập thất bại: " + (error?.message || "Lỗi không xác định"));
      console.error(error);
    },
  });

  const responseGoogle = (response) => {
    if (response.credential) {
      mutate({ token: response.credential });

    } else {
      console.error("No credential found", response);
    }
  };

  return (
    <div className="google-login">
      <button className="btn btn-danger flex-fill">
        <i className="bi bi-google me-1"></i> Đăng nhập bằng Google
        <div className="google-login-btn">
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => console.log("Login Failed")}
          />
        </div>
      </button>
    </div>
  );
}

export default GoogleLoginButton;
