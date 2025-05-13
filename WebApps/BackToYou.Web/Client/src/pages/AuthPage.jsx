import { Outlet, useLocation } from "react-router-dom";
import AuthLayout from "../features/authentication/AuthLayout";

const crumbMap = {
  "/login": "Đăng nhập",
  "/register": "Đăng ký",
  "/forgot-password": "Quên mật khẩu",
  "/reset-password": "Đặt lại mật khẩu"
};

function AuthPage() {
  const location = useLocation();
  const crumb = crumbMap[location.pathname] || "Xác thực";

 return (
    <AuthLayout crumb={crumb}>
      <Outlet />
    </AuthLayout>
  );
}

export default AuthPage;
