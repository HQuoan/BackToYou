import { useState } from "react";

function ImageWithPopup({ src, alt }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Ảnh nhỏ */}
      <img
        src={src}
        alt={alt}
        className="custom-block-image img-fluid"
        onClick={() => setIsOpen(true)}
        style={{ cursor: "zoom-in" }}
      />

      {/* Modal hiển thị ảnh lớn */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content">
            <img src={src} alt={alt} />
          </div>
        </div>
      )}
    </>
  );
}

export default ImageWithPopup;
