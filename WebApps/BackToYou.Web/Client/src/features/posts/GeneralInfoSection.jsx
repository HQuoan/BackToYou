import { useFormContext } from "react-hook-form";
import { useCategories } from "./useCategories";
import LabelWithPopover from "../../ui/LabelWithPopover";
import { usePostSettings } from "./usePostSettings";
import { PostLabel_Priority_Price, Priority_Days } from "../../utils/constants";

function GeneralInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { categories } = useCategories();

  // const { isPending, price } = usePostPriorityPrice();
  const { isPending, postSettings } = usePostSettings();

  const price = Number(
    postSettings?.find((p) => p.name === PostLabel_Priority_Price)?.value ?? 0
  );
  const priorityDays = Number(
    postSettings?.find((p) => p.name === Priority_Days)?.value ?? 0
  );

  return (
    <div id="general" className="section mb-5 rounded card">
      <div className="card-header d-flex align-items-center">
        <span className="icon-circle me-2">
          <i className="bi bi-file-text"></i>
        </span>
        <h5 className="mb-0">Tổng quan</h5>
      </div>
      <div className="card-body">
        {/* Tiêu đề */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Tiêu đề</label>
          <input
            type="text"
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            {...register("title", { required: "Tiêu đề là bắt buộc" })}
          />
          {errors.title && (
            <p className="text-danger mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Loại bài đăng + Ngày mất */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Loại bài đăng</label>
            <div className="d-flex gap-4">
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  value="Normal"
                  id="Normal"
                  {...register("postLabel", {
                    required: "Vui lòng chọn loại bài đăng",
                  })}
                />
                <label className="form-check-label" htmlFor="Normal">
                  Tin thường
                </label>
              </div>
              <div className="form-check position-relative">
                {!isPending && (
                  <>
                    <input
                      type="radio"
                      className="form-check-input"
                      value="Priority"
                      id="Priority"
                      {...register("postLabel", {
                        required: "Vui lòng chọn loại bài đăng",
                      })}
                    />
                    <LabelWithPopover
                      htmlFor="Priority"
                      label="Tin ưu tiên"
                      popover={`Tin ưu tiên sẽ hiển thị ở đầu trang chủ trong vòng ${priorityDays} ngày.\nVới mức giá ${price.toLocaleString()} xu/tin`}
                    />
                    <p className="text-danger mt-1">
                      {price.toLocaleString()} xu/tin
                    </p>
                  </>
                )}
              </div>
            </div>
            {errors.postLabel && (
              <p className="text-danger mt-1">{errors.postLabel.message}</p>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Ngày mất</label>
            <input
              type="date"
              className={`form-control ${
                errors.lostOrFoundDate ? "is-invalid" : ""
              }`}
              {...register("lostOrFoundDate", {
                required: "Ngày mất là bắt buộc",
              })}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.lostOrFoundDate && (
              <p className="text-danger mt-1">
                {errors.lostOrFoundDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Loại + Danh mục */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Loại</label>
            <select
              className={`form-select ${errors.postType ? "is-invalid" : ""}`}
              {...register("postType", { required: "Loại là bắt buộc" })}
            >
              <option value="">Select an option</option>
              <option value="Lost">Báo mất</option>
              <option value="Found">Nhặt được</option>
            </select>
            {errors.postType && (
              <p className="text-danger mt-1">{errors.postType.message}</p>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Danh mục</label>
            <select
              className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
              {...register("categoryId", {
                required: "Vui lòng chọn danh mục",
              })}
            >
              <option value="">Select an option</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-danger mt-1">{errors.categoryId.message}</p>
            )}
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Mô tả chi tiết</label>
          <textarea
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            rows="4"
            {...register("description", {
              required: "Mô tả không được để trống",
            })}
          ></textarea>
          {errors.description && (
            <p className="text-danger mt-1">{errors.description.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoSection;
