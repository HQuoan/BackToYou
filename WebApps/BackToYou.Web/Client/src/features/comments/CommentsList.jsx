import { useState } from "react";
import mockComments from "../../data/mockComments";
import CommentCard from "./CommentCard";
import { useCreateComment } from "./useCreateComment";
import { useComments } from "./useComments";

function CommentsList({ postId }) {
  const [inputComment, setInputComment] = useState("");
  // let comments = [];

  // if (comments.length === 0) comments = mockComments;

  const { isCreating, createComment } = useCreateComment();

  function handleSubmit(e) {
    e.preventDefault();

    createComment(
      {
        postId,
        description: inputComment,
      },
      {
        onSuccess: (data) => {
          setInputComment("");
        },
      }
    );
  }

  const {comments} = useComments(postId);

  return (
    <div className="comments-list mt-5 mb-5">
      <h4 className="section-title mb-3">Bình luận ({comments.length})</h4>
      {/* form bình luận */}
      <form className="d-flex align-items-start mb-4">
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
            <button
              type="submit"
              onClick={handleSubmit}
              className="custom-btn"
              style={{ padding: "8px 24px" }}
              disabled={!inputComment || isCreating}
            >
              {isCreating ? (
                <span className="d-flex align-items-center">
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Đang tạo...
                </span>
              ) : (
                "Bình luận"
              )}
            </button>
          </div>
        </div>
      </form>

      {comments.map((comment, index) => (
        <CommentCard key={index} comment={comment} />
      ))}
    </div>
  );
}

export default CommentsList;

{
  /* <button
type="submit"
className="custom-btn px-5 py-3 badge"
disabled={(!selectedImage && !textQuery) || isPending}
onClick={handleSearch}
>
{isPending ? (
  <span className="d-flex align-items-center">
    <span className="spinner-border spinner-border-sm me-2"></span>
    Đang phân tích...
  </span>
) : (
  "Tìm kiếm bằng AI"
)}
</button> */
}
