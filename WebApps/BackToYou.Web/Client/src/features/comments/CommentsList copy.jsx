// import { useState, useEffect } from "react";
// import { useComments } from "./useComments";
// import CommentItem from "./CommentItem";
// import CommentForm from "./CommentForm";
// import { useUser } from "../authentication/useUser";
// import { Link, useLocation } from "react-router-dom";
// import { useComment } from "./useComment";

// function CommentsList({ postId }) {
//   const location = useLocation();
//   const [pageNumber, setPageNumber] = useState(1);
//   const [commentList, setCommentList] = useState([]);
//   const [totalComments, setTotalComments] = useState(0);

//   const [targetCommentId, setTargetCommentId] = useState(null);

//   useEffect(() => {
//     const hash = window.location.hash;
//     if (hash.startsWith("#comment-")) {
//       const id = hash.replace("#comment-", "");
//       setTargetCommentId(id);
//     }
//   }, []);

//   const { comment: targetComment } = useComment(
//     targetCommentId,
//     Boolean(targetCommentId)
//   );

//   /* cập nhật mỗi khi hash đổi */
//   useEffect(() => {
//     if (location.hash.startsWith("#comment-")) {
//       setTargetCommentId(location.hash.replace("#comment-", ""));
//     } else {
//       setTargetCommentId(null);
//     }
//   }, [location.hash]);

//   console.log("target", targetComment);

//   const { isAuthenticated } = useUser();

//   const { comments, pagination, isPending } = useComments(postId, pageNumber);

//   useEffect(() => {
//     if (!comments || comments.length === 0) return;

//     if (pageNumber === 1) {
//       // Lần đầu load, thay thế luôn commentList
//       setCommentList(comments);
//     } else {
//       // Merge nếu là trang tiếp theo
//       setCommentList((prevComments) => {
//         const existingIds = new Set(prevComments.map((c) => c.commentId));
//         const newComments = comments.filter(
//           (c) => !existingIds.has(c.commentId)
//         );
//         return [...prevComments, ...newComments];
//       });
//     }
//   }, [comments, pageNumber]);

//   useEffect(() => {
//     if (pagination?.totalItems !== undefined) {
//       setTotalComments(pagination.totalItems);
//     }
//   }, [pagination?.totalItems]);

//   useEffect(() => {
//     if (!targetCommentId) return;

//     const element = document.getElementById("comment-list");
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth", block: "start" });
//       element.classList.add("bg-warning-subtle");
//       setTimeout(() => element.classList.remove("bg-warning-subtle"), 2000);
//     }
//   }, [targetComment, commentList, targetCommentId]);

//   const hasMorePages = pagination && pageNumber < pagination.totalPages;

//   const handleLoadMore = () => setPageNumber((prev) => prev + 1);

//   const handleNewComment = (newComment) => {
//     setCommentList((prev) => [newComment, ...prev]);
//     setTotalComments((prev) => prev + 1);
//   };

//   const handleDeleteComment = (commentId) => {
//     if (!commentId) return;

//     setCommentList((prev) => prev.filter((c) => c.commentId !== commentId));
//     setTotalComments((prev) => prev - 1);
//   };

//   return (
//     <div id="comment-list" className="comments-list mt-5 mb-5">
//       <h4 className="section-title mb-3">Bình luận ({totalComments})</h4>

//       <div className="mb-4">
//         {isAuthenticated ? (
//           <CommentForm postId={postId} onSuccess={handleNewComment} />
//         ) : (
//           <div className="d-flex justify-content-center">
//             <Link to="/login">
//               <button className="custom-btn">Đăng nhập để bình luận</button>
//             </Link>
//           </div>
//         )}
//       </div>

//       {targetComment && (
//         <CommentItem
//           key={targetComment.commentId}
//           comment={targetComment}
//           postId={postId}
//           onDelete={handleDeleteComment}
//           targetCommentId={targetCommentId}
//         />
//       )}

//       {commentList.map((comment) =>
//         comment.commentId !== targetCommentId ? (
//           <CommentItem
//             key={comment.commentId}
//             comment={comment}
//             postId={postId}
//             onDelete={handleDeleteComment}
//             targetCommentId={targetCommentId}
//           />
//         ) : null
//       )}

//       {hasMorePages && (
//         <div className="mb-4">
//           <div className="d-flex justify-content-end mt-2">
//             <button
//               className="custom-btn"
//               onClick={handleLoadMore}
//               disabled={isPending}
//             >
//               {isPending ? "Đang tải..." : "Xem thêm"}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CommentsList;
