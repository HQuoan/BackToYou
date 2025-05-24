import { useState } from "react";
import { formatDateVN, formatPhoneNumber } from "../utils/helpers";
import ImageWithPopup from "./ImageWithPopup";
import PostTypeBadge from "./PostTypeBadge ";
import PriorityLabel from "./PriorityLabel";
import ReportModal from "./ReportModal";
import { useUser } from "../features/authentication/useUser";
import toast from "react-hot-toast";

function DetailPost({ post }) {
  const [mainImage, setMainImage] = useState(post.thumbnailUrl);
  const [showReportModal, setShowReportModal] = useState(false);

  const { user } = useUser();
  const isOwn = user?.id === post?.userId;

  function handleReport() {
    if (!user) toast.error("Vui lòng đăng nhập để dùng chức năng này!");
    else setShowReportModal(true);
  }

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
              <div className="custom-block-top d-flex mb-1">
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
            </div>
            <div className="profile-block profile-detail-block d-flex flex-wrap align-items-center mt-5">
              <div className="ms-3 mb-3 mb-lg-0 mb-md-0">
                {/* <img
                  src="images/profile/woman-posing-black-dress-medium-shot.jpg"
                  className="profile-block-image img-fluid"
                  alt="Profile"
                /> */}

                <h5>Thông tin liên hệ</h5>
                <p>
                  <strong>Tên: {post.postContact.name ?? "Unknown"}</strong>
                  <strong>
                    Phone:{" "}
                    {formatPhoneNumber(post.postContact.phone ?? "Unknown")}
                  </strong>
                  <strong>
                    Email:{" "}
                    {formatPhoneNumber(post.postContact.email ?? "Unknown")}
                  </strong>
                </p>
              </div>

              <ul className="social-icon ms-lg-auto ms-md-auto">
                {post.postContact?.facebook && (
                  <li className="social-icon-item">
                    <a
                      href={post.postContact.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon-link bi-facebook"
                    ></a>
                  </li>
                )}

                <li className="social-icon-item">
                  <a
                    href={`https://mail.google.com/mail/u/0/?view=cm&to=${post.postContact.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-link bi-envelope"
                  ></a>
                </li>

                 <li className="social-icon-item">
                  <a
                    href={`tel:${post.postContact.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-link bi-whatsapp"
                  ></a>
                </li>

                <button onClick={handleReport} className="btn custom-btn">
                  Báo cáo
                </button>
              </ul>
            </div>
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
