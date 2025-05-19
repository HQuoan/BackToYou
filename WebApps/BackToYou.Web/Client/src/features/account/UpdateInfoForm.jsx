import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useUpdateInfo } from "./useUpdateInfo";
import Spinner from "../../ui/Spinner";
import { getInitials } from "../../utils/helpers";
import { useUploadAvatar } from "./useUploadAvatar";
import { useUser } from "../authentication/useUser";

const UpdateInfoForm = () => {
 const { isPending, user } = useUser();
 
  //AVATAR
  const { uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadAvatar(file);
  };

  // INFORMATION
  const [initialData, setInitialData] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { isPending: isUpdating, updateInfo } = useUpdateInfo();

  useEffect(() => {
    if (user) {
      const initialValues = {
        fullName: user.fullName,
        phoneNumber: user.phoneNumber || "",
        sex: user.sex || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      };

      setInitialData(initialValues);
      reset(initialValues);
    }
  }, [user, reset]);

  if (isPending)
    return (
      <div className="text-center">
        <Spinner />
        <h3>Đang tải thông tin...</h3>
      </div>
    );

  const onSubmit = (data) => {
    if (JSON.stringify(data) !== JSON.stringify(initialData)) {
      updateInfo(data);
    }
  };

  return (
    <form className="profile-section" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-black-custom">Thông tin tài khoản</h2>
      <p className="text-grey-custom">
        Cập nhật thông tin tài khoản của bạn.
      </p>

      <div className="profile-info-block">
        <div className="profile-info-image-wrapper">
          {user?.avatar ? (
            <img src={user.avatar} className="avatar-profile" alt="avatar" />
          ) : (
            <span className="profile-info-initials">
              {getInitials(user?.shortName)}
            </span>
          )}
        </div>

        <label className="custom-btn profile-info-update-btn">
          {isUploadingAvatar ? "Đang tải lên..." : "Chọn một ảnh mới"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
            disabled={isUploadingAvatar}
          />
        </label>
      </div>

      <div className="profile-info-details">
        <div className="row">
          <div className="col-6">
            <div className="profile-info-field">
              <label className="text-grey-custom">Email</label>
              <input
                type="text"
                value={user?.email}
                className="form-control"
                disabled
              />
            </div>
          </div>
          <div className="col-6">
            <div className="profile-info-field">
              <label className="text-grey-custom">Tên rút gọn</label>
              <input
                value={user?.shortName}
                className="form-control"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="profile-info-field">
              <label className="text-grey-custom">Tên</label>
              <input
                type="text"
                {...register("fullName", {
                  required: "Tên không được bỏ trống",
                  minLength: {
                    value: 2,
                    message: "Tên phải có ít nhất 2 ký tự",
                  },
                })}
                className="form-control"
              />
              {errors.fullName && (
                <span className="text-danger">{errors.fullName.message}</span>
              )}
            </div>
          </div>
          <div className="col-6">
            <div className="profile-info-field">
              <label className="text-grey-custom">Phone</label>
              <input
                type="text"
                {...register("phoneNumber", {
                  validate: (value) =>
                    value === "" ||
                    /^[0-9]{10,11}$/.test(value) ||
                    "Số điện thoại phải gồm 10–11 chữ số",
                })}
                className="form-control"
              />
              {errors.phoneNumber && (
                <span className="text-danger">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="profile-info-field">
              <label className="text-grey-custom">Giới tính</label>
              <select
                {...register("sex", {
                  required: "Vui lòng chọn giới tính",
                })}
                className="form-control"
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
              {errors.sex && (
                <span className="text-danger">{errors.sex.message}</span>
              )}
            </div>
          </div>
          <div className="col-6">
            <div className="profile-info-field">
              <label className="text-grey-custom">Ngày sinh</label>
              <input
                type="date"
                {...register("dateOfBirth", {
                  required: "Vui lòng chọn ngày sinh",
                  validate: (value) =>
                    new Date(value) < new Date() ||
                    "Ngày sinh phải nhỏ hơn ngày hiện tại",
                })}
                className="form-control"
              />
              {errors.dateOfBirth && (
                <span className="text-danger">
                  {errors.dateOfBirth.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-end mt-3">
        <button
          type="submit"
          className="custom-btn profile-info-save-btn"
          disabled={isUpdating}
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default UpdateInfoForm;
