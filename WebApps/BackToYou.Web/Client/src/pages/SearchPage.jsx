import { useEffect, useState } from "react";
import { usePosts } from "../features/posts/usePosts";
import Pagination from "../ui/Pagination";
import PostCard from "../ui/PostCard";
import SideBar from "../ui/SideBar";
import Spinner from "../ui/Spinner";
import { useSearchParams } from "react-router-dom";
import NoData from "../ui/NoData";

function SearchPage() {
  const { isPending, posts, pagination } = usePosts();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timeout;
    if (isPending) {
      setShowSpinner(true);
    } else {
      timeout = setTimeout(() => setShowSpinner(false), 300); // giữ thêm 300ms
    }
    return () => clearTimeout(timeout);
  }, [isPending]);


  const [searchParams] = useSearchParams();
  const pageNumber = searchParams.get("PageNumber");
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageNumber]);
  

  return (
    <>
      <div className="site-header"></div>

      <div className="container header-content-overlay">
        <div className="row min-height-600 bg-white shadow rounded p-3">
          <div className="col-md-3 scrollable-sidebar">
            <SideBar />
          </div>
          <div className="col-md-9">
            {showSpinner ? (
              <div className="d-flex justify-content-center align-items-center w-100" style={{ minHeight: "600px" }}>
                <Spinner />
              </div>
            ) : (
              <>
                <div className="row">
                  {posts.length === 0 ? <NoData/> : posts.map((item, i) => (
                    <div className="col-lg-4 col-6 mb-4" key={i}>
                      <PostCard post={item} />
                    </div>
                  ))}
                </div>
                <div className="row">
                  <Pagination pagination={pagination} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPage;
