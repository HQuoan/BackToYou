import mockComments from "../data/mockComments";



function CommentsList({ comments }) {

  if (comments.length == 0)
    comments = mockComments
  
  return (
    <div className="comments-list">
      <h4 className="section-title">Comments</h4>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        <ul className="list-group">
          {comments.map((comment, index) => (
            <li key={index} className="list-group-item">
              <div className="comment-body">
                <p><strong>{comment.createdBy}</strong> says:</p>
                <p>{comment.content}</p>
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentsList;
