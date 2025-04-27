import mockPosts from "../data/mockPosts";
import PostCard from "../ui/PostCard";
import SideBar from "../ui/SideBar";

function SearchPage() {
  return (
    <>
      <div className="site-header"></div>

      <div className="container header-content-overlay">
          <div className="row min-height-600 bg-white shadow rounded p-3">
            <div className="col-md-3">
              <SideBar />
            </div>
            <div className="col-md-9">
              <div className="row">
                {mockPosts.map((item, i) => (
                  <div className="col-lg-4 col-6 mb-4" key={i}>
                    <PostCard post={item} />
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </>
  );
}

export default SearchPage;
