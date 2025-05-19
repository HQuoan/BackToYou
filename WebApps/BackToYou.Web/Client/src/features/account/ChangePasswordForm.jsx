import { useForm } from "react-hook-form";
import { useChangePassword } from "./useChangePassword";

function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const { changePassword, isPending } = useChangePassword();

  const newPassword = watch("newPassword");

  const onSubmit = (data) => {
    changePassword(data,
      // {
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword,
      //   confirmNewPassword: data.confirmNewPassword,
      // },
      {
        onSuccess: () => reset(),
      }
    );
  };

  return (
    <form className="profile-section" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-black-custom">Đổi mật khẩu</h2>
      <p className="text-grey-custom">Cập nhật mật khẩu đăng nhập của bạn.</p>

      <div className="profile-info-field">
        <label className="text-grey-custom">Mật khẩu hiện tại</label>
        <input
          type="password"
          className="form-control"
          {...register("currentPassword", {
            required: "Vui lòng nhập mật khẩu hiện tại",
          })}
        />
        {errors.currentPassword && (
          <span className="text-danger">{errors.currentPassword.message}</span>
        )}
      </div>

      <div className="profile-info-field mt-3">
        <label className="text-grey-custom">Mật khẩu mới</label>
        <input
          type="password"
          className="form-control"
          {...register("newPassword", {
            required: "Vui lòng nhập mật khẩu mới",
            minLength: {
              value: 8,
              message: "Mật khẩu phải có ít nhất 8 ký tự",
            },
            validate: {
              hasUpperCase: (value) =>
                /[A-Z]/.test(value) ||
                "Mật khẩu phải có ít nhất một chữ cái in hoa",
              hasLowerCase: (value) =>
                /[a-z]/.test(value) ||
                "Mật khẩu phải có ít nhất một chữ cái thường",
              hasNumber: (value) =>
                /[0-9]/.test(value) || "Mật khẩu phải có ít nhất một chữ số",
              hasSpecialChar: (value) =>
                /[\W_]/.test(value) ||
                "Mật khẩu phải có ít nhất một ký tự đặc biệt",
            },
          })}
        />
        {errors.newPassword && (
          <span className="text-danger">{errors.newPassword.message}</span>
        )}

        {errors.newPassword && (
          <span className="text-danger">{errors.newPassword.message}</span>
        )}
      </div>

      <div className="profile-info-field mt-3">
        <label className="text-grey-custom">Xác nhận mật khẩu mới</label>
        <input
          type="password"
          className="form-control"
          {...register("confirmNewPassword", {
            required: "Vui lòng xác nhận mật khẩu mới",
            validate: (value) =>
              value === newPassword || "Mật khẩu xác nhận không khớp",
          })}
        />
        {errors.confirmNewPassword && (
          <span className="text-danger">
            {errors.confirmNewPassword.message}
          </span>
        )}
      </div>

      <div className="text-end mt-4">
        <button
          type="submit"
          className="custom-btn profile-info-save-btn"
          disabled={isPending}
        >
          Đổi mật khẩu
        </button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;
