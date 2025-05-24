import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import PostTypeBadge from "../PostTypeBadge ";
import { Link } from "react-router-dom";

const RecentPostCard = ({ post }) => {
  return (
    <div className="col-lg-4 col-12 mb-4 mb-lg-4">
      <div className="custom-block custom-block-full pb-3">
        <div className="custom-block-image-wrap img-wrapper">
          <Link to={`/${post.slug}`} state={{ post }}>
            <img
              src={post.thumbnailUrl}
              className="custom-block-image img-fluid"
              alt={post.title}
            />
          </Link>

        </div>
        <div className="custom-block-info">
          <h5 className="mb-2">
            <Link to={`/${post.slug}`} state={{ post }} className="line-clamp-1">
              {post.title}
            </Link>
          </h5>

          <p className="mb-2 line-clamp-2">{post.description}</p>

          <div className="gap-1">
            <PostTypeBadge type={post.postType} />
            <span className="badge badge-category mb-1">
              <i className="bi-box me-1"></i>
              {post.category?.name}
            </span>
          </div>

          <span className="badge mb-2">
            <i className="bi-geo-alt me-1"></i>
           {post.location.district}, {post.location.province}
          </span>

          <div className="text-success d-flex justify-content-between mt-1">
          <span>
            <i className="bi-person-fill me-1"></i>
            {post.createdBy.split(':')[0]}
          </span>
            <span>
              <i className="bi-clock me-2"></i>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: vi,
              })}
            </span>
          </div>
        </div>
        {/* <div className="social-share d-flex flex-column ms-auto">
          <a href="#" className="badge ms-auto">
            <i className="bi-heart"></i>
          </a>
          <a href="#" className="badge ms-auto">
            <i className="bi-bookmark"></i>
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default RecentPostCard;
