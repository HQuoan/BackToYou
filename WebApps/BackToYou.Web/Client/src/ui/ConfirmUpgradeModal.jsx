import { usePostSettings } from "../features/posts/usePostSettings";
import { PostLabel_Priority_Price, Priority_Days } from "../utils/constants";

const ConfirmUpgradeModal = ({ isOpen, onCancel, onConfirm }) => {
  const { isPending, postSettings } = usePostSettings();

  const price = Number(
    postSettings?.find((p) => p.name === PostLabel_Priority_Price)?.value ?? 0
  );
  const priorityDays = Number(
    postSettings?.find((p) => p.name === Priority_Days)?.value ?? 0
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h5 className="mb-3">Xác nhận nâng cấp bài viết</h5>
        <p>Bạn có chắc chắn muốn nâng cấp bài viết này lên ưu tiên trong {priorityDays} ngày với mức giá {price.toLocaleString()} xu không ?</p>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-outline-secondary" onClick={onCancel}>
            Không
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Nâng cấp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmUpgradeModal;
