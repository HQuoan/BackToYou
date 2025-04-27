import { useState } from "react";
import mockComments from "../data/mockComments";
import CommentCard from "./CommentCard";

function CommentsList({ comments }) {
  const [inputComment, setInputComment] = useState("");

  if (comments.length === 0) comments = mockComments;

  return (
    <div className="comments-list mt-5 mb-5">
      <h4 className="section-title mb-3">Bình luận ({comments.length})</h4>
      {/* form bình luận */}
      <div className="d-flex align-items-start mb-4">
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
            VH
          </div>
        </div>
        <div className="flex-grow-1">
          <textarea
            className="form-control"
            placeholder="Nhập bình luận của bạn tại đây"
            value={inputComment}
            onChange={(e) => setInputComment(e.target.value)}
            rows={3}
            style={{ resize: "none" }}
          ></textarea>
          <div className="d-flex justify-content-end mt-2">
            <button className="custom-btn" style={{ padding: "8px 24px" }}>
              Bình luận
            </button>
          </div>
        </div>
      </div>

      {comments.map((comment, index) => (
        <CommentCard key={index} comment={comment} />
      ))}
    </div>
  );
}

export default CommentsList;
