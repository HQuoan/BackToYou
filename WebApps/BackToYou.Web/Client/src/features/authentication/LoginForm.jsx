import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useLogin } from "./useLogin";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "admin@gmail.com",
      password: "Admin@123",
    },
  });

  const { isPending, login } = useLogin();

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 pb-1 border rounded bg-light"
      >
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Nhập email của bạn
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="email"
            placeholder="email@gmail.com"
            {...register("email", { required: "Email không được để trống" })}
          />
          {errors.email && (
            <p className="text-danger mt-2 ms-2">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">
            Nhập mật khẩu
          </label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            id="password"
            placeholder="******"
            {...register("password", {
              required: "Mật khẩu không được để trống",
            })}
          />
          {errors.password && (
            <p className="text-danger mt-2 ms-2">{errors.password.message}</p>
          )}
        </div>

        <div className="d-grid">
          <button type="submit" className="btn custom-btn" disabled={isPending}>
            {isPending ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </div>
        <div className="text-center mt-1">
          <Link to="/forgot-password" className="text-primary-custom ms-2">
            Quên mật khẩu ?
          </Link>
        </div>
      </form>

      <p className="text-center mt-3">
        Bạn chưa có tài khoản?
        <Link to="/register" className="text-primary-custom ms-2">
          Đăng ký
        </Link>
      </p>
    </>
  );
}

export default LoginForm;
