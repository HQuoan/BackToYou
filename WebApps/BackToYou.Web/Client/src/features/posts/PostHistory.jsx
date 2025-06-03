import { Link, useSearchParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { formatDateVN } from "../../utils/helpers";
import PostTypeBadge from "../../ui/PostTypeBadge ";
import PriorityLabel from "../../ui/PriorityLabel";
import { useMyPosts } from "./useMyPosts";
import Pagination from "../../ui/Pagination";
import Spinner from "../../ui/Spinner";
import { useState } from "react";
import {
  POST_LABEL_NORMAL,
  POST_STATUS_APPROVED,
  POST_STATUS_PENDING,
  POST_STATUS_PROCESSING,
  POST_STATUS_REJECTED,
} from "../../utils/constants";
import { useDeletePost } from "./useDeletePost";
import ConfirmDeleteModal from "../../ui/ConfirmDeleteModal ";
import { useUpgradePriorityPost } from "./useUpgradePriorityPost";
import ConfirmUpgradeModal from "../../ui/ConfirmUpgradeModal";

const PostHistory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(undefined);
  const { isPending, posts, pagination } = useMyPosts({
    postStatus: statusFilter,
    orderBy: "-lastmodified"
  });

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmUpgradeModal, setShowConfirmUpgradeModal] = useState(false);

  const { isDeleting, deletePost } = useDeletePost();

  const { isUpgrading, upgradePriorityPost } = useUpgradePriorityPost();

  function handleDelete(postId) {
    setSelectedPostId(postId);
    setShowConfirmModal(true);
  }

  function cancelDelete() {
    setSelectedPostId(null);
    setShowConfirmModal(false);
  }

  function confirmDelete() {
    if (selectedPostId) {
      deletePost(selectedPostId);
      setSelectedPostId(null);
      setShowConfirmModal(false);
    }
  }

  function handleUpgrade(postId) {
    setSelectedPostId(postId);
    setShowConfirmUpgradeModal(true);
  }

  function cancelUpgrade() {
    setSelectedPostId(null);
    setShowConfirmUpgradeModal(false);
  }
  function confirmUpgrade() {
    if (selectedPostId) {
      upgradePriorityPost(selectedPostId);
      setSelectedPostId(null);
      setShowConfirmUpgradeModal(false);
    }
  }

  return (
    <section className="history-section section-padding">
      <div className="container">
        <div className="history-header">
          <h2 className="text-black-custom section-title">Lịch sử bài đăng</h2>
        </div>

        {/* Filter status */}
        <div className="receipts-filter-nav account-nav">
          {[
            "All",
            POST_STATUS_PENDING,
            POST_STATUS_PROCESSING,
            POST_STATUS_APPROVED,
            POST_STATUS_REJECTED,
          ].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status === "All" ? undefined : status);
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.delete("PageNumber");
                newParams.delete("PageSize");
                setSearchParams(newParams);
              }}
              className={`nav-link ${
                statusFilter === status || (status === "All" && !statusFilter)
                  ? "active"
                  : ""
              }`}
            >
              {status}
            </button>
          ))}
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
                  <div className="col-5">
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
                  <div className="col-4">
                    <div
                      className={`history-item-status ${
                        post.postLabel === "Priority" ? "mt-4" : ""
                      }`}
                    >
                      <span>Trạng thái bài viết:</span>
                      <div
                        className={`receipt-status status-${post.postStatus.toLowerCase()} mt-1`}
                      >
                        {post.postStatus}
                      </div>

                      {post.postStatus === POST_STATUS_PENDING ||
                      post.postStatus === POST_STATUS_REJECTED ? (
                        <>
                          <Link
                            to={`/listing/edit/${post.slug}`}
                            className="btn custom-btn edit-btn mt-2"
                          >
                            Chỉnh sửa
                          </Link>

                          <button
                            className="btn custom-btn cancel-btn mt-2"
                            onClick={() => handleDelete(post.postId)}
                            disabled={isDeleting}
                          >
                            {isDeleting
                              ? "Đang xử lý ..."
                              : "Hủy bài & Hoàn tiền"}
                          </button>
                        </>
                      ) : null}

                      {post.postStatus === POST_STATUS_APPROVED &&
                        post.postLabel === POST_LABEL_NORMAL && (
                          <button
                            className="btn custom-btn upgrade-btn mt-2"
                            onClick={() => handleUpgrade(post.postId)}
                            disabled={isUpgrading}
                          >
                            {isUpgrading ? "Đang xử lý ..." : "Nâng cấp"}
                          </button>
                        )}
                    </div>
                  </div>
                  {post.postStatus === "Rejected" && (
                    <div className="history-item-reason">
                      Lý do từ chối:{" "}
                      {post.rejectionReason || "Không có lý do cụ thể"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="row">
              <Pagination pagination={pagination} pageSize={5} />
            </div>
          </>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={showConfirmModal}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />

      <ConfirmUpgradeModal
        isOpen={showConfirmUpgradeModal}
        onCancel={cancelUpgrade}
        onConfirm={confirmUpgrade}
      />
    </section>
  );
};

export default PostHistory;
