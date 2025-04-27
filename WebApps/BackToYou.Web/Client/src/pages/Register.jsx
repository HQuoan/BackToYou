import AuthLayout from "../features/authentication/AuthLayout";
import RegisterForm from "../features/authentication/RegisterForm";

function Register() {
  return (
    <AuthLayout crumb="Đăng ký">
      <RegisterForm />
    </AuthLayout>
  );
}

export default Register;
