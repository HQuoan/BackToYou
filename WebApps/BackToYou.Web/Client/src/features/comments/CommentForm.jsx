import { useState } from "react";
import { useCreateComment } from "./useCreateComment";

function CommentForm({ postId, parentCommentId = null, onSuccess }) {
  const [inputComment, setInputComment] = useState("");
  const { isCreating, createComment } = useCreateComment();

  function handleSubmit(e) {
    e.preventDefault();
    createComment(
      {
        postId,
        description: inputComment,
        parentCommentId,
      },
      {
        onSuccess: (data) => {
          setInputComment("");
          onSuccess?.(data?.result);
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="form-control"
        placeholder="Nhập bình luận tại đây..."
        value={inputComment}
        onChange={(e) => setInputComment(e.target.value)}
        rows={3}
        style={{ resize: "none" }}
      ></textarea>
      <div className="d-flex justify-content-end mt-2">
        <button
          type="submit"
          className="custom-btn"
          disabled={!inputComment || isCreating}
          style={{ padding: "8px 24px" }}
        >
          {isCreating ? (
            <span className="d-flex align-items-center">
              <span className="spinner-border spinner-border-sm me-2"></span>
              Đang gửi...
            </span>
          ) : (
            "Gửi"
          )}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
