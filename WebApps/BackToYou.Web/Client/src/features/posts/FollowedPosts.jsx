import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { formatDateVN } from "../../utils/helpers";
import PostTypeBadge from "../../ui/PostTypeBadge ";
import PriorityLabel from "../../ui/PriorityLabel";
import Pagination from "../../ui/Pagination";
import Spinner from "../../ui/Spinner";
import { useFollowedPosts } from "./useFollowedPosts";

const FollowedPosts = () => {
  const { isPending, posts, pagination } = useFollowedPosts();

  return (
    <section className="history-section following section-padding">
      <div className="container">
        <div className="history-header">
          <h2 className="text-black-custom section-title">
            Danh sách theo dõi
          </h2>
        </div>

        {posts.length === 0 ? (
          <p className="text-grey-custom text-center min-height-200">
            Hiện không có bài đăng nào.
          </p>
        ) : isPending ? (
          <Spinner />
        ) : (
          <>
            <div className="history-list">
              {posts.map((post) => (
                <div
                  key={post.postId}
                  className="history-item custom-block row"
                >
                  <div className="col-3">
                    <div className="history-item-image-wrapper img-wrapper">
                      <Link to={`/${post.slug}`} state={{ post }}>
                        <img
                          src={post.thumbnailUrl}
                          alt={post.title}
                          className="history-item-image custom-block-image"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="history-item-info">
                      <Link
                        to={`/${post.slug}`}
                        state={{ post }}
                        className="history-item-title line-clamp-2"
                      >
                        {post.title}
                      </Link>
                      <div className="d-flex">
                        <PostTypeBadge type={post.postType} />
                        <span className="badge badge-lost-or-found-date mb-1">
                          <i className="bi bi-calendar-fill me-1"></i>
                          {formatDateVN(post.createdAt)}
                        </span>
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <div>
                          <span className="badge badge-category mb-1">
                            <i className="bi bi-box me-1"></i>
                            {post.category?.name}
                          </span>
                          <span className="badge badge-price mb-1">
                            <i className="bi bi-currency-dollar me-1"></i>
                            {post?.price.toLocaleString()}
                          </span>
                        </div>
                        <span className="badge badge-location">
                          <i className="bi bi-geo-alt me-1"></i>
                          {post.location.district}, {post.location.province}
                        </span>
                      </div>
                      <div className="text-success d-flex align-items-center mt-1">
                        <span>
                          <i className="bi bi-clock me-2"></i>
                          {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                      </div>
                      <PriorityLabel postLabel={post.postLabel} />
                    </div>
                  </div>

                  <div className="col-3">
                    <Link to={`/${post.slug}`} state={{ post }} className="btn custom-btn">
                      Chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="row">
              <Pagination pagination={pagination} pageSize={5} />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FollowedPosts;
