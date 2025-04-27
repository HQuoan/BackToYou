function CommentCard({ comment }) {
  const initials = comment.createdBy
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="d-flex mb-4 p-4 bg-light rounded shadow">
      <div className="me-3">
        <div
          className="d-flex justify-content-center align-items-center bg-secondary rounded-circle"
          style={{
            width: "50px",
            height: "50px",
            fontSize: "16px",
            color: "#fff",
          }}
        >
          {initials}
        </div>
      </div>
      <div className="flex-grow-1">
        <div className="d-flex align-items-center mb-2">
          <span className="me-2 fw-bold text-primary-custom">
            {comment.createdBy}
          </span>
          <small className="text-muted">
            {new Date(comment.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </small>
        </div>
        <p className="mb-1">{comment.description}</p>
        <div className="mt-2">
          <button
            className="btn btn-sm border-btn-custom rounded-pill px-3"
            style={{ fontSize: "12px" }}
          >
            Trả lời
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
