import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function GoogleLoginButton() {
  const responseGoogle = (response) => {
    if (response.error) {
      console.error('Google login failed:', response.error);
    } else {
      // Gửi mã token lên backend để xác thực
      fetch('https://localhost:5052/auth/signin-google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // credentials: 'include',
        body: JSON.stringify({ token: response.credential }),
      })
        .then(res => res.json())
        .then(data => {
          console.log('Login successful:', data);
          // Lưu JWT token hoặc thông tin người dùng từ backend
        })
        .catch(error => console.error('Error during login:', error));
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId} >
        <GoogleLogin
          onSuccess={responseGoogle}
          onError={() => console.log("Login Failed")}
        />
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;