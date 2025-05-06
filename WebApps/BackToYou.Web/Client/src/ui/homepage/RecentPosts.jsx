import mockPosts from "../../data/mockPosts";
import RecentPostCard from "./RecentPostCard";

const RecentPosts = () => (
  <section className="trending-podcast-section section-padding">
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-12">
          <div className="section-title-wrap mb-5">
            <h4 className="section-title">Bài đăng mới nhất</h4>
          </div>
        </div>
        {mockPosts.map((item, i) => (
          <RecentPostCard key={i} post={item} />
        ))}
      </div>
    </div>
  </section>
);

export default RecentPosts;
