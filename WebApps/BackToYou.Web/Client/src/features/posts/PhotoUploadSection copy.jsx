import { useFormContext } from "react-hook-form";

function PhotoUploadSection() {
  const { register } = useFormContext();

  return (
    <div id="photos" className="section mb-5 rounded card">
      <div className="card-header d-flex align-items-center">
        <span className="icon-circle me-2">
          <i className="bi bi-camera"></i>
        </span>
        <h5 className="mb-0">Ảnh</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Ảnh nhặt được (optional)</label>
          <input type="file" className="form-control" {...register("photos")} />
          <small className="form-text text-muted">
            Maximum file size: 2 MB
          </small>
          <div className="photo-upload-area d-flex align-items-center justify-content-center">
            <i className="bi bi-plus-circle"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoUploadSection;
