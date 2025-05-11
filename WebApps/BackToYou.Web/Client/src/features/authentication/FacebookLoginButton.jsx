import  { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLoginWithFacebook } from './useLogin';

const appId = import.meta.env.VITE_FACEBOOK_APP_ID;

function FacebookLoginButton() {
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: appId,
        cookie: true,
        xfbml: true,
        version: 'v18.0', 
      });
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  const {loginWithFacebook} = useLoginWithFacebook();

  const handleLogin = () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const { accessToken } = response.authResponse;
          loginWithFacebook({token: accessToken});
        } else {
          toast.error('User cancelled login or did not fully authorize.');
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  return (
    <button className="btn btn-primary flex-fill" onClick={handleLogin}>
      <i className="bi bi-facebook me-1"></i> Đăng nhập bằng Facebook
    </button>
  );
}

export default FacebookLoginButton;
