function ImageUploadPlaceholder() {
  return (
    <div
      className="d-flex align-items-center justify-content-center border"
      style={{
        width: "80px",
        height: "80px",
        borderRadius: "10px",
        border: "2px dashed #aaa",
        backgroundColor: "var(--color-grey-0)"
      }}
    >
      <i className="bi bi-plus-circle fs-3 text-primary-custom"></i>
    </div>
  );
}

export default ImageUploadPlaceholder;
