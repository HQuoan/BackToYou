import mockPosts from "../data/mockPosts";
import RecentPostCard from "../ui/RecentPostCard";
import SideBar from "../ui/SideBar";

function SearchPage() {
  return (
    <>
      <div className="site-header"></div>
      <div className="container header-content-overlay" >
        <div className="row min-height-600 bg-white shadow rounded p-3" >
          <div className="col-md-3" >
            <SideBar />
          </div>
          <div className="col-md-9">
            <div className="row">
              {/* <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard /> */}
            {mockPosts.map((item, i) => (
                <RecentPostCard key={i} post={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


export default SearchPage;

{
  /* <>
      <div className="site-header">
        
      </div>
      <section className="latest-podcast-section section-padding pb-0">
        <div className="container">
          <h1>Contact page</h1>
        </div>
      </section>
    </> */
}
