import mockPosts from "../data/mockPosts";
import PostCard from "../ui/PostCard";
import SideBar from "../ui/SideBar";

function SearchPage() {
  return (
    <>
      <div className="site-header"></div>
     
      <div className="container header-content-overlay">
        {/* <div className="row">
          <header className=" d-flex flex-column justify-content-center align-items-center">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="mb-0 text-white">Contact Page</h2>
            </div>
          </header>
        </div> */}
        <div className="row min-height-600 bg-white shadow rounded p-3">
          <div className="col-md-3">
            <SideBar />
          </div>
          <div className="col-md-9">
            <div className="row">
              {mockPosts.map((item, i) => (
                <PostCard key={i} post={item} />
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
