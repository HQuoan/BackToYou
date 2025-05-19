import { usePosts } from "../../features/posts/usePosts";
import RecentPostCard from "./RecentPostCard";
import Spinner from "./../Spinner";
import { Link } from "react-router-dom";

function RecentPosts({ postLabel, categorySlug }) {
  const { isPending, posts } = usePosts({ postLabel, categorySlug });

  let title = "Bài đăng mới nhất";
  if (categorySlug) title = "Bài đăng liên quan";

  return (
    <section className="trending-podcast-section section-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-12">
            <div className="section-title-wrap mb-5">
              <h4 className="section-title">{title}</h4>
            </div>
          </div>
          {isPending ? (
            <Spinner />
          ) : (
            posts.map((item, i) => <RecentPostCard key={i} post={item} />)
          )}
        </div>
        {posts.length > 0 && (
          <div className="d-flex justify-content-end mt-2">
            <Link  to={`/search${categorySlug ? `?CategorySlug=${categorySlug}` : ''}`} className="nav-link">
              <button className="custom-btn">Xem thêm</button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default RecentPosts;
