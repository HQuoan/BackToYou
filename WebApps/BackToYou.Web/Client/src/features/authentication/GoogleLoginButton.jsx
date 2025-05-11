import { GoogleLogin } from "@react-oauth/google";
import { useLoginWithGoogle } from "./useLogin";

function GoogleLoginButton() {
  const { loginWithGoogle } = useLoginWithGoogle();

  const responseGoogle = (response) => {
    if (response.credential) {
      loginWithGoogle({ token: response.credential });
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
