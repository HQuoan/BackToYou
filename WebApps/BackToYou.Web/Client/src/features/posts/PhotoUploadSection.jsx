import { useFormContext } from "react-hook-form";
import { useState } from "react";
import ImageUploadPlaceholder from "../../ui/ImageUploadPlaceholder";

function PhotoUploadSection() {
  const { setValue } = useFormContext();
  const [previews, setPreviews] = useState([]);

  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const currentFiles = previews.map((p) => p.file);
    const combinedFiles = [...currentFiles, ...newFiles].slice(0, 3); // max 3

    const updatedPreviews = combinedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews(updatedPreviews);
    setValue("photos", combinedFiles);
  };

  const removeImage = (index) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    setValue(
      "photos",
      updatedPreviews.map((p) => p.file)
    );
  };

  return (
    <div id="photos" className="section mb-5 rounded card">
      <div className="card-header d-flex align-items-center">
        <span className="icon-circle me-2">
          <i className="bi bi-camera"></i>
        </span>
        <h5 className="mb-0">Ảnh</h5>
      </div>
      <div className="card-body">
        <label className="form-label">Ảnh nhặt được (tối đa 3 ảnh)</label>

        <div
          className="photo-upload-area border rounded d-flex flex-wrap gap-3 p-3 mb-2"
          style={{ cursor: "pointer", minHeight: "100px" }}
          onClick={() => document.getElementById("photoInput").click()}
        >
          {previews.map((img, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <img
                src={img.url}
                alt={`preview-${idx}`}
                style={{
                  height: "120px",
                  width: "100%",
                  borderRadius: "6px",
                  objectFit: "cover",
                }}
              />
              <button
                type="button"
                className="btn-remove-img"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(idx);
                }}
              >
                ×
              </button>
            </div>
          ))}

          {previews.length < 3 && <ImageUploadPlaceholder/>}
        </div>

        <input
          id="photoInput"
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFilesChange}
        />

        <small className="form-text text-muted">
          Mỗi ảnh tối đa 2MB. Tối đa 3 ảnh.
        </small>
      </div>
    </div>
  );
}

export default PhotoUploadSection;
