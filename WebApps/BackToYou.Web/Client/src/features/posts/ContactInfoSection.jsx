import { useFormContext } from "react-hook-form";

function ContactInfoSection() {
  const { register } = useFormContext();

  return (
    <div id="contact" className="section mb-5 rounded card">
      <div className="card-header d-flex align-items-center">
        <span className="icon-circle me-2">
          <i className="bi bi-telephone"></i>
        </span>
        <h5 className="mb-0">Thông tin liên hệ để lấy lại</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Họ và tên (optional)</label>
          <input
            type="text"
            className="form-control"
            {...register("fullName")}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Số điện thoại (optional)</label>
          <input type="text" className="form-control" {...register("phone")} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email (optional)</label>
          <input type="email" className="form-control" {...register("email")} />
        </div>
        <div className="mb-3">
          <label className="form-label">Facebook (optional)</label>
          <input
            type="text"
            className="form-control"
            {...register("facebook")}
          />
        </div>
      </div>
    </div>
  );
}

export default ContactInfoSection;
