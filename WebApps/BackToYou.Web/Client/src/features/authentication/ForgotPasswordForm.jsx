import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useForgotPassword } from './useForgotPassword';

function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "huyvodtan@gmail.com",
    },
  });

  const { isPending, forgotPassword } = useForgotPassword();

  const onSubmit = (data) => {
    forgotPassword(data);
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

export default ForgotPasswordForm;
