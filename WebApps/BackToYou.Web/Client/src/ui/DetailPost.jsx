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
            <div className="custom-block-image-wrap custom-block-image-detail-page">
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
            <div className="custom-block-top d-flex mb-1">
              <PostTypeBadge type={post.postType} />
              <span className="badge badge-category mb-1">
                <i className="bi-calendar-fill me-1"></i>
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <span className="badge mb-1">
                <i className="bi-geo-alt me-1"></i>
                {post.location.ward}, {post.location.district}
              </span>

              <div className="ms-auto">
                <PriorityLabel postLabel={post.postLabel} />
              </div>
            </div>

            <h2 className="mb-2 mt-3">{post.title}</h2>
            <p>{post.description}</p>

            <p>
              Địa chỉ: {post.location.streetAddress}, {post.location.ward},{" "}
              {post.location.district}, {post.location.province}
            </p>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas
              eos nobis facilis iusto! Totam at, maiores iure vel incidunt rerum
              in assumenda odio molestiae? Et, amet. Temporibus quibusdam neque
              numquam.
            </p>

            <div className="profile-block profile-detail-block d-flex flex-wrap align-items-center mt-5">
              <div className="d-flex mb-3 mb-lg-0 mb-md-0">
                <img
                  src="images/profile/woman-posing-black-dress-medium-shot.jpg"
                  className="profile-block-image img-fluid"
                  alt="Profile"
                />

                <p>
                  {post.createdBy}
                  <img
                    src="images/verified.png"
                    className="verified-image img-fluid ms-1"
                    alt="Verified"
                  />{" "}
                  <strong>Influencer</strong>
                </p>
              </div>

              <ul className="social-icon ms-lg-auto ms-md-auto">
                <li className="social-icon-item">
                  <a href="#" className="social-icon-link bi-instagram"></a>
                </li>

                <li className="social-icon-item">
                  <a href="#" className="social-icon-link bi-twitter"></a>
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
