import { useLocation, useParams } from "react-router-dom";
import CommentsList from "../features/comments/CommentsList";
import DetailPost from "../ui/DetailPost";
import RecentPosts from "../ui/homepage/RecentPosts";
import { usePost } from "../features/posts/usePost";
import Spinner from "../ui/Spinner";

function Detail() {
  const location = useLocation();
  const { slug } = useParams();
  const postFromState = location.state?.post;

  const shouldFetch = !postFromState && !!slug;
  const { post, isPending } = usePost(slug, shouldFetch);
  const finalPost = postFromState || post;

  return (
    <>
      <div className="site-header"></div>

      {!finalPost ? (
        <section style={{ minHeight: 400 }}>
          <div className="d-flex flex-column justify-content-center align-items-center text-center">
            {isPending ? (
              <>
                <Spinner />
                <p className="mt-2">Đang tải bài viết...</p>
              </>
            ) : (
              <h4 className="fw-bold">Không tìm thấy bài viết</h4>
            )}
          </div>
        </section>
      ) : (
        <>
          <div className="container shadow rounded header-content-overlay">
            <div className="row justify-content-center">
              <div className="col-lg-10 col-12">
                <DetailPost post={finalPost} />
                <CommentsList postId={finalPost.postId} />
              </div>
            </div>
          </div>
          <RecentPosts categorySlug={finalPost?.category.slug} />
        </>
      )}
    </>
  );
}

export default Detail;
