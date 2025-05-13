import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function LoginRequiredModal({ show }) {
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (show && window.bootstrap) {
      const modal = new window.bootstrap.Modal(modalRef.current);
      modal.show();

      const modalElement = modalRef.current;

      const handleHidden = () => {
        navigate("/", { replace: true });
      };

      modalElement.addEventListener("hidden.bs.modal", handleHidden);

      return () => {
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        modalElement.removeEventListener("hidden.bs.modal", handleHidden);
      };
    }
  }, [show, navigate]);

  const handleLogin = () => {
    const modal = window.bootstrap.Modal.getInstance(modalRef.current);
    modal.hide();
    navigate("/login", { replace: true });
  };

  const handleCancel = () => {
    const modal = window.bootstrap.Modal.getInstance(modalRef.current);
    modal.hide();
    navigate("/");
  };

  return (
    <>
      <div className="site-header"></div>
      <div
        className="modal fade custom-modal"
        tabIndex="-1"
        ref={modalRef}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Yêu cầu đăng nhập</h5>
            </div>
            <div className="modal-body">
              <p>Bạn cần đăng nhập để truy cập trang này.</p>
            </div>
            <div className="modal-footer">
              <button onClick={handleCancel} className="btn btn-secondary">
                Hủy
              </button>
              <button onClick={handleLogin} className="btn btn-primary">
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginRequiredModal;