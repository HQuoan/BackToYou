import { useLocation } from "react-router-dom";
import CommentsList from "../features/comments/CommentsList";
import DetailPost from "../ui/DetailPost";
import RecentPosts from "../ui/homepage/RecentPosts";

function Detail() {
  const location = useLocation();
  const { post } = location.state || {};

  return (
    <>
      <div className="site-header"></div>
      <div className="container shadow rounded header-content-overlay">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-12">
            <DetailPost post={post} />
            <CommentsList postId={post.postId} />
          </div>
        </div>
      </div>
      <RecentPosts />
    </>
  );
}

export default Detail;
