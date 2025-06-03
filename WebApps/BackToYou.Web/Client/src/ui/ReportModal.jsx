import { useForm } from "react-hook-form";
import { useCreateReport } from "../features/reports/useCreateReport";
import {
  POST_LABEL_FOUND,
  POST_TYPE_FOUND,
  POST_TYPE_LOST,
  REPORT_TITLES,
  REPORT_TITLES_VN,
} from "../utils/constants";

const ReportModal = ({ isOpen, onCancel, onConfirm, post, isOwn }) => {
  const { isCreating, createReport } = useCreateReport();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  if (!isOpen) return null;

  const onSubmit = (data) => {
    createReport(
      { postId: post.postId, ...data },
      {
        onSuccess: () => {
          reset();
          onConfirm(); // Đóng modal sau khi thành công
        },
        onError: (err) => {
          console.error("Report failed:", err);
        },
      }
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <h5 className="mb-3">Báo cáo bài viết</h5>

          <label className="form-label">Lý do báo cáo</label>
          <select
            {...register("title", { required: "Vui lòng chọn lý do báo cáo" })}
            className="form-control"
          >
            <option value="">-- Chọn lý do --</option>

            {isOwn ? (
              <option value={REPORT_TITLES.REQUEST_REMOVE_POST}>
                {REPORT_TITLES_VN.REQUEST_REMOVE_POST}
              </option>
            ) : (
              <>
                <option value={REPORT_TITLES.FAKE_REPORT}>
                  {REPORT_TITLES_VN.FAKE_REPORT}
                </option>

                {post.postType === POST_TYPE_FOUND && (
                  <option value={REPORT_TITLES.CLAIM_OWNER}>
                    {REPORT_TITLES_VN.CLAIM_OWNER}
                  </option>
                )}
              </>
            )}

            {/* {post.postType === POST_TYPE_LOST && (
             
            )} */}
            {post.postLabel !== POST_LABEL_FOUND && (
              <option value={REPORT_TITLES.FOUND_LOST_ITEM}>
                {REPORT_TITLES_VN.FOUND_LOST_ITEM}
              </option>
            )}
          </select>
          {errors.title && (
            <p className="mb-0">
              <small className="text-danger">{errors.title.message}</small>
            </p>
          )}

          <label className="form-label mt-3">Nội dung</label>
          <textarea
            {...register("description", {
              required: "Vui lòng nhâp lý do báo cáo",
            })}
            className="form-control"
            rows={3}
            placeholder="Thêm mô tả"
          />
          {errors.description && (
            <small className="text-danger">{errors.description.message}</small>
          )}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                reset(); // reset form
                onCancel();
              }}
              disabled={isCreating}
            >
              Hủy
            </button>
            <button type="submit" className="btn custom-btn">
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
