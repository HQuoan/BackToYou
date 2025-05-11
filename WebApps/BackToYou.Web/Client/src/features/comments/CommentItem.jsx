import { useState } from "react";
import CommentForm from "./CommentForm";
import { useDeleteComment } from "./useDeleteComment";

function CommentItem({ comment, postId, onDelete }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState(comment.childComments ?? []);
  const { deleteComment } = useDeleteComment();

  const initials = comment.createdBy
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const isParentComment = !comment.parentCommentId;

  const handleAddReply = (newReply) => {
    setReplies((prev) => [...prev, newReply]);
    setIsReplying(false);
  };

  const handleDeleteReply = (replyId) => {
    if (!replyId) return;
    setReplies((prev) => prev.filter((c) => c.commentId !== replyId));
  };

  const handleDelete = () => {
    deleteComment(comment.commentId, {
      onSuccess: () => onDelete(comment.commentId),
    });
  };

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
            <button type="button" className="btn text-danger" onClick={handleDelete}>
              Xóa
            </button>
          </div>
          <p className="mb-1">{comment.description}</p>

          {isParentComment && (
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
                onSuccess={handleAddReply}
              />
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ms-5 mt-3">
          {replies.map((reply) => (
            <CommentItem
              key={reply.commentId}
              comment={reply}
              postId={postId}
              onDelete={handleDeleteReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
