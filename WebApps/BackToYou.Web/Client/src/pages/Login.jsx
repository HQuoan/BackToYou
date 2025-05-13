import LoginForm from "../features/authentication/LoginForm";
import AuthLayout from "../features/authentication/AuthLayout";

const Login = () => {
  return (
    <AuthLayout crumb="Đăng nhập">
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;


