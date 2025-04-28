import React from 'react';
import FacebookLogin from 'react-facebook-login';

const appId = import.meta.env.VITE_FACEBOOK_APP_ID;

function FacebookLoginButton() {
  const responseFacebook = (response) => {
    if (response.status === 'unknown' || !response.accessToken) {
      console.error('Facebook login failed:', response);
      return;
    }

    // Send access token to backend
    fetch('https://localhost:5052/auth/signin-facebook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: response.accessToken }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Login successful:', data);
        // Store JWT token or user info
      })
      .catch((error) => console.error('Error during login:', error));
  };

  return (
    <FacebookLogin
      appId={appId}
      fields="name,email,picture"
      callback={responseFacebook}
      icon="fa-facebook"
      textButton="Login with Facebook"
    />
  );
}

export default FacebookLoginButton;