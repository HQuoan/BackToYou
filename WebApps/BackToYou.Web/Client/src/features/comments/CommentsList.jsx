import { useState, useEffect } from "react";
import { useComments } from "./useComments";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { useUser } from "../authentication/useUser";
import { Link } from "react-router-dom";

function CommentsList({ postId }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [commentList, setCommentList] = useState([]);
  const [totalComments, setTotalComments] = useState(0);

  const { isAuthenticated } = useUser();

  const { comments, pagination, isPending } = useComments(postId, pageNumber);

  useEffect(() => {
    setCommentList((prevComments) => {
      const existingIds = new Set(prevComments.map((c) => c.commentId));
      const mergedComments = [...prevComments];

      comments.forEach((comment) => {
        if (!existingIds.has(comment.commentId)) {
          mergedComments.push(comment);
        }
      });

      return mergedComments;
    });

    if (pagination?.totalItems !== undefined) {
      setTotalComments(pagination.totalItems);
    }
  }, [comments, pagination]);

  const hasMorePages = pagination && pageNumber < pagination.totalPages;

  const handleLoadMore = () => setPageNumber((prev) => prev + 1);

  const handleNewComment = (newComment) => {
    setCommentList((prev) => [newComment, ...prev]);
    setTotalComments((prev) => prev + 1);
  };

  const handleDeleteComment = (commentId) => {
    if (!commentId) return;

    setCommentList((prev) => prev.filter((c) => c.commentId !== commentId));
    setTotalComments((prev) => prev - 1);
  };

  return (
    <div className="comments-list mt-5 mb-5">
      <h4 className="section-title mb-3">Bình luận ({totalComments})</h4>

      <div className="mb-4">
        {isAuthenticated ? (
          <CommentForm postId={postId} onSuccess={handleNewComment} />
        ) : (
          <div className="d-flex justify-content-center">
            <Link to="/login">
              <button className="custom-btn">Đăng nhập để bình luận</button>
            </Link>
          </div>
        )}
      </div>

      {commentList.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          postId={postId}
          onDelete={handleDeleteComment}
        />
      ))}

      {hasMorePages && (
        <div className="mb-4">
          <div className="d-flex justify-content-end mt-2">
            <button
              className="custom-btn"
              onClick={handleLoadMore}
              disabled={isPending}
            >
              {isPending ? "Đang tải..." : "Xem thêm"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentsList;
