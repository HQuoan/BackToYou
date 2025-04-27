import { useLocation } from "react-router-dom";
import CommentsList from "../ui/CommentsList";
import RecentPosts from "../ui/RecentPosts";
import DetailPost from "../ui/DetailPost";

function Detail() {
  const location = useLocation();
  const { post } = location.state || {};
  // const post = mockPosts[1];

  return (
    <>
      <div className="site-header"></div>
      <div className="container shadow rounded header-content-overlay">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-12">
              <DetailPost post={post} />
              <CommentsList comments={post.comments} />
            </div>
          </div>
        </div>
      <RecentPosts />
    </>
  );
}

export default Detail;
