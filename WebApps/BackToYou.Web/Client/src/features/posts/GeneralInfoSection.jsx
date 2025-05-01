import { useFormContext } from "react-hook-form";

function GeneralInfoSection() {
  const { register } = useFormContext();

  return (
    <div id="general" className="section mb-5 rounded card">
      <div className="card-header d-flex align-items-center">
        <span className="icon-circle me-2">
          <i className="bi bi-file-text"></i>
        </span>
        <h5 className="mb-0">Tổng quan</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Tiêu đề</label>
          <input type="text" className="form-control" {...register("title")} />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Loại</label>
            <select className="form-select" {...register("type")}>
              <option value="">Select an option</option>
              <option value="Lost">Báo mất</option>
              <option value="Found">Nhặt được</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Danh mục</label>
            <select className="form-select" {...register("category")}>
              <option value="">Select an option</option>
              <option value="GiayTo">Giấy tờ</option>
              <option value="ViTien">Ví tiền</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả chi tiết</label>
          <textarea
            className="form-control"
            rows="4"
            {...register("description")}
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoSection;
