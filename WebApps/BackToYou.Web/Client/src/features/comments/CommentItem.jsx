import { useState } from "react";
import CommentForm from "./CommentForm";

function CommentItem({ comment, replies = [], postId }) {
  const [isReplying, setIsReplying] = useState(false);

  const initials = comment.createdBy
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const isParent = !comment.parentCommentId;

  return (
    <div className="mb-3 ms-0">
      <div className="d-flex p-3 bg-light rounded shadow">
        <div className="me-3">
          <div
            className="d-flex justify-content-center align-items-center bg-secondary rounded-circle"
            style={{ width: 50, height: 50, fontSize: 16, color: "#fff" }}
          >
            {initials}
          </div>
        </div>
        <div className="flex-grow-1">
          <div className="d-flex align-items-center mb-2">
            <span className="me-2 fw-bold text-primary-custom">
              {comment.createdBy.split(":")[0]}
            </span>
            <small className="text-muted">
              {new Date(comment.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>
          <p className="mb-1">{comment.description}</p>

          {isParent && (
            <div className="mt-2">
              <button
                className="btn btn-sm border-btn-custom rounded-pill px-3"
                style={{ fontSize: "12px" }}
                onClick={() => setIsReplying((prev) => !prev)}
              >
                {isReplying ? "Hủy" : "Trả lời"}
              </button>
            </div>
          )}

          {isReplying && (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                parentCommentId={comment.commentId}
                onSuccess={() => setIsReplying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* render replies */}
      {replies.length > 0 && (
        <div className="ms-5 mt-3">
          {replies.map((reply) => (
            <CommentItem
              key={reply.commentId}
              comment={reply}
              postId={postId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
