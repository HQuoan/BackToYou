import { useComments } from "./useComments";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

function CommentsList({ postId }) {
  const { comments } = useComments(postId);

  // phân chia cha - con
  const parentComments = comments.filter((c) => !c.parentCommentId);
  const childComments = comments.filter((c) => c.parentCommentId);

  function getReplies(parentId) {
    return childComments.filter((c) => c.parentCommentId === parentId);
  }

  return (
    <div className="comments-list mt-5 mb-5">
      <h4 className="section-title mb-3">Bình luận ({comments.length})</h4>

      <div className="mb-4">
        <CommentForm postId={postId} />
      </div>

      {parentComments.map((parent) => (
        <CommentItem
          key={parent.commentId}
          comment={parent}
          replies={getReplies(parent.commentId)}
          postId={postId}
        />
      ))}
    </div>
  );
}

export default CommentsList;
