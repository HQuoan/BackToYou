// components/ImageModal.jsx
function ImageModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        cursor: "zoom-out",
      }}
    >
      <img
        src={imageUrl}
        alt="Zoomed view"
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
}

export default ImageModal;
