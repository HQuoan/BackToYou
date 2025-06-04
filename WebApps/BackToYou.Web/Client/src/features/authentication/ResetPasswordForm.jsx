import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { useResetPassword } from './useResetPassword';

function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      token,
      email,
    },
  });

  const { isPending, resetPassword } = useResetPassword();

  const onSubmit = (data) => {
    resetPassword(data);

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

        <div className="mb-3">
          <label htmlFor="token" className="form-label">
            Token
          </label>
          <input
            type="text"
            className={`form-control ${errors.token ? "is-invalid" : ""}`}
            id="fullName"
            {...register("token", { required: "Token is required." })}
          />
          {errors.token && (
            <div className="invalid-feedback">{errors.token.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            Nhập mật khẩu
          </label>
          <input
            type="password"
            className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
            id="newPassword"
            placeholder="******"
            {...register("newPassword", {
              required: "New password is required.",
              minLength: {
                value: 8,
                message: "New password  must be between 8 and 100 characters.",
              },
              maxLength: {
                value: 100,
                message: "New password  must be between 8 and 100 characters.",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                message:
                  "New password  must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
              },
            })}
          />
          {errors.newPassword && (
            <div className="invalid-feedback">{errors.newPassword.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmNewPassword" className="form-label">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            className={`form-control ${
              errors.confirmNewPassword ? "is-invalid" : ""
            }`}
            id="confirmNewPassword"
            placeholder="******"
            {...register("confirmNewPassword", {
              required: "Please confirm your password.",
              validate: (value) =>
                value === watch("newPassword") ||
                "The password and confirmation password do not match.",
            })}
          />
          {errors.confirmNewPassword && (
            <div className="invalid-feedback">
              {errors.confirmNewPassword.message}
            </div>
          )}
        </div>

        <div className="d-grid">
          <button type="submit" className="btn custom-btn" disabled={isPending}>
            {isPending ? "Đang xử lý..." : "Gửi yêu cầu"}
          </button>
        </div>
      </form>

      <p className="text-center mt-3">
        Bạn đã có tài khoản?
        <Link to="/login" className="text-primary-custom ms-2">
          Đăng nhập
        </Link>
      </p>
    </>
  );
}

export default ResetPasswordForm;
