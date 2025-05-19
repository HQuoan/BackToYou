import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useRegister } from "./useRegister";

function RegisterForm() {
  const { isPending, register: registerAPI } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data) => {
    registerAPI(data);
  };

  return (
    <>
      <form
        className="p-4 border rounded bg-light"
        onSubmit={handleSubmit(onSubmit)}
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
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email address.",
              },
            })}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">
            Họ và tên
          </label>
          <input
            type="text"
            className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
            id="fullName"
            placeholder="Võ Minh Huy"
            {...register("fullName", { required: "FullName is required." })}
          />
          {errors.fullName && (
            <div className="invalid-feedback">{errors.fullName.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">
            Số điện thoại
          </label>
          <input
            type="text"
            className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
            id="phoneNumber"
            placeholder="0123456789"
            {...register("phoneNumber", {
              required: "PhoneNumber is required.",
              pattern: {
                value: /^\d{9,}$/,
                message:
                  "Phone number must contain only numbers and be at least 9 digits.",
              },
            })}
          />
          {errors.phoneNumber && (
            <div className="invalid-feedback">{errors.phoneNumber.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Nhập mật khẩu
          </label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            id="password"
            placeholder="******"
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Password must be between 8 and 100 characters.",
              },
              maxLength: {
                value: 100,
                message: "Password must be between 8 and 100 characters.",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
              },
            })}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="form-label">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            className={`form-control ${
              errors.confirmPassword ? "is-invalid" : ""
            }`}
            id="confirmPassword"
            placeholder="******"
            {...register("confirmPassword", {
              required: "Please confirm your password.",
              validate: (value) =>
                value === watch("password") ||
                "The password and confirmation password do not match.",
            })}
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>

        <div className="d-grid">
          <button type="submit" className="btn custom-btn" disabled={isPending}>
            {isPending ? "Đang xử lý..." : "Đăng ký"}
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

export default RegisterForm;
