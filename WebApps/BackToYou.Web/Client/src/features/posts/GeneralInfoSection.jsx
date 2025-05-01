import { useFormContext } from "react-hook-form";

function GeneralInfoSection() {
  const { register } = useFormContext();

  return (
    <div id="general" className="section mb-5 rounded card">
      <div className="card-header d-flex align-items-center">
        <span className="icon-circle me-2">
          <i className="bi bi-file-text"></i>
        </span>
        <h5 className="mb-0">General</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Tiêu đề</label>
          <input type="text" className="form-control" {...register("title")} />
        </div>
        <div className="mb-3">
          <label className="form-label">Loại (optional)</label>
          <select className="form-select" {...register("type")}>
            <option value="">Select an option</option>
            <option value="GiayTo">Giấy tờ</option>
            <option value="ViTien">Ví tiền</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Mô tả chi tiết</label>
          <textarea
            className="form-control"
            rows="3"
            {...register("description")}
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoSection;
