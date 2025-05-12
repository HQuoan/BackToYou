import { useFormContext } from "react-hook-form";

function ContactInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div id="contact" className="section mb-5 rounded card">
      <div className="card-header d-flex align-items-center">
        <span className="icon-circle me-2">
          <i className="bi bi-telephone"></i>
        </span>
        <h5 className="mb-0">Thông tin liên hệ để lấy lại</h5>
      </div>
      <div className="card-body">
        {/* Họ và tên */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Họ và tên</label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            {...register("name", { required: "Họ và tên là bắt buộc" })}
          />
          {errors.name && <p className="text-danger mt-1">{errors.name.message}</p>}
        </div>

        {/* Số điện thoại */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Số điện thoại</label>
          <input
            type="text"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            {...register("phone", {
              required: "Số điện thoại là bắt buộc",
              pattern: {
                value: /^[0-9]{9,11}$/,
                message: "Số điện thoại không hợp lệ",
              },
            })}
          />
          {errors.phone && <p className="text-danger mt-1">{errors.phone.message}</p>}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            {...register("email", {
              required: "Email là bắt buộc",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email không hợp lệ",
              },
            })}
          />
          {errors.email && <p className="text-danger mt-1">{errors.email.message}</p>}
        </div>

        {/* Facebook (không bắt buộc nhưng validate nếu có) */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Facebook (optional)</label>
          <input
            type="text"
            className="form-control"
            {...register("facebook", {
              pattern: {
                value: /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?$/,
                message: "Link Facebook không hợp lệ",
              },
            })}
          />
          {errors.facebook && <p className="text-danger mt-1">{errors.facebook.message}</p>}
        </div>
      </div>
    </div>
  );
}

export default ContactInfoSection;
