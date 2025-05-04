import { formatDateVN, formatPhoneNumber } from "../utils/helpers";
import PostTypeBadge from "./PostTypeBadge ";
import PriorityLabel from "./PriorityLabel";

function DetailPost({ post }) {
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
              <img
                src={post.thumbnailUrl}
                className="custom-block-image img-fluid"
                alt={post.title}
              />
            </div>
          </div>
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
                  Địa chỉ {post.postType === "Lost" ? "mất" : "nhặt"}:{" "}
                  {post.location.streetAddress}, {post.location.ward}
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
                  <strong>Tên: {post.postContact?.name ?? "Unknown"}</strong>
                  <strong>
                    Phone: {formatPhoneNumber(post.postContact?.phone ?? "Unknown")}
                  </strong>
                </p>
              </div>

              <ul className="social-icon ms-lg-auto ms-md-auto">
                <li className="social-icon-item">
                  <a href="#" className="social-icon-link bi-person-fill"></a>
                </li>

                <li className="social-icon-item">
                  <a href="#" className="social-icon-link bi-facebook"></a>
                </li>

                <li className="social-icon-item">
                  <a href="#" className="social-icon-link bi-whatsapp"></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailPost;
