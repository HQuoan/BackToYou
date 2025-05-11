import { useState, useEffect } from "react";
import { useComments } from "./useComments";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

function CommentsList({ postId }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [allComments, setAllComments] = useState([]);
  
  const { comments, pagination, isPending } = useComments(postId, pageNumber);
  
  const [totalItems, setTotalItems] = useState(pagination?.totalItems || 0)

  useEffect(() => {
    setAllComments((prev) => {
      const existingIds = new Set(prev.map((c) => c.commentId));
      const merged = [...prev];
      comments.forEach((c) => {
        if (!existingIds.has(c.commentId)) merged.push(c);
      });
      return merged;
    });

    setTotalItems(pagination?.totalItems)
  }, [comments]);


  const hasMore = pagination && pageNumber < pagination.totalPages;

  function handleLoadMore() {
    setPageNumber((prev) => prev + 1);
  }

  function handleNewComment(newComment) {
    setAllComments((prev) => [newComment, ...prev]);
    setTotalItems((prev) => (prev + 1))
  }

  function handleDeleteParentComment(commentId) {
    commentId &&
      setTotalItems((prev) => (prev - 1))
      setAllComments((prev) => {
        return prev.filter((c) => c.commentId != commentId);
      });
  }

  return (
    <div className="comments-list mt-5 mb-5">
      <h4 className="section-title mb-3">
        Bình luận ({totalItems})
      </h4>

      <div className="mb-4">
        <CommentForm postId={postId} onSuccess={handleNewComment} />
      </div>

      {allComments.map((parent) => (
        <CommentItem
          key={parent.commentId}
          comment={parent}
          postId={postId}
          deleteCmt={handleDeleteParentComment}
        />
      ))}

      {hasMore && (
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
