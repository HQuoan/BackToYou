import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { loginWithFacebook } from '../../services/apiAuth';
import toast from 'react-hot-toast';

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

  const { isPending, mutate } = useMutation({
    mutationFn: (data) => {
      return loginWithFacebook(data);
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

  const handleLogin = () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const { accessToken } = response.authResponse;
          mutate({token: accessToken});
        } else {
          console.error('User cancelled login or did not fully authorize.');
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
