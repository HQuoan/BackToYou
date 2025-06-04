import { useState } from "react";
import {
  formatDateTimeVN,
  formatDateVN,
} from "../utils/helpers";
import ImageWithPopup from "./ImageWithPopup";
import PostTypeBadge from "./PostTypeBadge ";
import PriorityLabel from "./PriorityLabel";
import ReportModal from "./ReportModal";
import { useUser } from "../features/authentication/useUser";
import { POST_LABEL_FOUND, POST_LABEL_PRIORITY } from "../utils/constants";
import ContactInfo from "./ContactInfo";

function DetailPost({ post }) {
  const [mainImage, setMainImage] = useState(post.thumbnailUrl);
  const [showReportModal, setShowReportModal] = useState(false);

  const { user } = useUser();
  const isOwn = user?.id === post?.userId;

  function cancelReport() {
    setShowReportModal(false);
  }

  function confirmReport() {
    setShowReportModal(false);
  }

  return (
    <>
      <div className="section-title-wrap mb-5 mt-4">
        <h4 className="section-title text-primary-custom">
          {post.category.name}
        </h4>
      </div>
      <div className="row">
        <div className="col-lg-3 col-12">
          <div className="custom-block-icon-wrap">
            <div className="custom-block-image-wrap custom-block-image-detail-page img-wrapper detail-page">
              <ImageWithPopup src={mainImage} alt={post.title} />
            </div>
          </div>
          {post.postImages && post.postImages.length > 1 && (
            <div className="post-thumbnails mt-3 d-flex gap-2 flex-wrap">
              {post.postImages.map((img) => (
                <img
                  key={img.postImageId}
                  src={img.imageUrl}
                  alt="Ảnh phụ"
                  className="img-thumbnail"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    cursor: "pointer",
                    border:
                      mainImage === img.imageUrl
                        ? "2px solid #007bff"
                        : "1px solid #ccc",
                  }}
                  onClick={() => setMainImage(img.imageUrl)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="col-lg-9 col-12">
          <div className="custom-block-info">
            <div className="min-height-300">
              <div className="custom-block-top mb-1 d-flex flex-wrap align-items-center">
                <PostTypeBadge type={post.postType} />
                <span className="badge badge-category mb-1">
                  <i className="bi-calendar-fill me-1"></i>
                  {formatDateVN(post.lostOrFoundDate)}
                </span>
                <span className="badge mb-1">
                  <i className="bi-geo-alt me-1"></i>
                  {post.location.district}, {post.location.province}
                </span>
                {isOwn && (
                  <span className="badge badge-author mb-1">
                    <i className="bi-person-check me-1"></i>
                    Bài viết của bạn
                  </span>
                )}

                <div className="ms-auto">
                  <PriorityLabel postLabel={post.postLabel} />
                  {post.postLabel === POST_LABEL_FOUND && (
                    <span className="post-label-block">Đã tìm thấy</span>
                  )}
                </div>
              </div>

              <h2 className="mb-3 mt-3 line-clamp-detail-title">
                {post.title}
              </h2>
              <p>{post.description}</p>

              <p>
                <strong>
                  Địa chỉ {post.postType === "Lost" ? "mất: " : "nhặt: "}
                  {post.location.streetAddress}, {post.location.ward + ", "}
                  {post.location.district}, {post.location.province}
                </strong>
              </p>

              {isOwn && post.postLabel === POST_LABEL_PRIORITY && (
                <div>
                  <p>
                    {" "}
                    <strong>Số ngày ưu tiên: {post.priorityDays ?? 0}</strong>
                  </p>
                  <p>
                    <strong>
                      Ngày hết ưu tiên:{" "}
                      {post.priorityStartAt && post.priorityDays
                        ? formatDateTimeVN(
                            new Date(
                              new Date(post.priorityStartAt).getTime() +
                                post.priorityDays * 24 * 60 * 60 * 1000
                            )
                          )
                        : "Chưa xác định"}
                    </strong>
                  </p>
                </div>
              )}
            </div>
            <ContactInfo
              post={post}
              onReport={() => setShowReportModal(true)}
            />
          </div>
        </div>
      </div>
      <ReportModal
        isOpen={showReportModal}
        onCancel={cancelReport}
        onConfirm={confirmReport}
        post={post}
        isOwn={isOwn}
      />
    </>
  );
}

export default DetailPost;
