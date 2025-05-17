const ConfirmDeleteModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h5 className="mb-3">Xác nhận hủy bài</h5>
        <p>Bạn có chắc chắn muốn hủy bài viết này và hoàn tiền không?</p>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-outline-secondary" onClick={onCancel}>
            Không
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Có, hủy bài
          </button>
        </div>
      </div>
    </div>
  );
};


export default ConfirmDeleteModal;
