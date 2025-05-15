import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { formatDateVN } from "../../utils/helpers";
import mockMyPosts from './../../data/mockMyPosts';
import PostTypeBadge from './../../ui/PostTypeBadge ';
import PriorityLabel from './../../ui/PriorityLabel';

const PostHistory = () => {
  const historyItems = mockMyPosts;

  return (
    <section className="history-section section-padding">
      <div className="container">
        <div className="history-header">
          <h2 className="text-black-custom section-title">Lịch sử bài đăng</h2>
        </div>
        <p className="text-grey-custom">
          Bạn đã đăng {historyItems.length} bài đăng gần đây
        </p>
        <div className="history-list">
          {historyItems.map((post) => (
            <div key={post.postId} className="history-item custom-block row">
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
                    <span className="badge badge-category mb-1">
                      <i className="bi bi-box me-1"></i>
                      {post.category?.name}
                    </span>
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
                <div className= {`history-item-status ${post.postLabel === "Priority" ? "mt-4" : ""}`}>
                  <span>Trạng thái bài viết:</span>
                  <div className={`receipt-status status-${post.postStatus.toLowerCase()} mt-1`}>
                    {post.postStatus}
                  </div>
                  <button className="btn custom-btn cancel-btn mt-2">
                    Hủy bài & Hoàn tiền
                  </button>
                </div>
              </div>
              {post.postStatus === "Rejected" && (
                <div className="history-item-reason">
                  Lý do từ chối: {post.rejectionReason || "Không có lý do cụ thể"} 
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PostHistory;