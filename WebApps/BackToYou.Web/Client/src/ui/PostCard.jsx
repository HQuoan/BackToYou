import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import PostTypeBadge from "./PostTypeBadge ";
import "./PostCard.css";
import PriorityLabel from "./PriorityLabel";
import { Link } from "react-router-dom";
import { formatDateVN } from "../utils/helpers";
import LinkShareFb from "./LinkShareFb";

const PostCard = ({ post, targetImgId = null }) => {
  if(targetImgId){
    const targetImg = post.postImages.find(i => i.postImageId === targetImgId);
    post.thumbnailUrl = targetImg.imageUrl
  }

  return (
    <div className="custom-block custom-block-full pb-3">
      <div className="custom-block-image-wrap img-wrapper">
        <Link to={`/${post.slug}`} state={{ post }}>
          <img
            src={post.thumbnailUrl}
            className="custom-block-image post-card img-fluid"
            alt={post.title}
          />
        </Link>
      </div>
      <div className="custom-block-info">
        <h6 className="mb-2">
          <Link to={`/${post.slug}`} state={{ post }} className="line-clamp-1">
            {post.title}
          </Link>
        </h6>

        <p className="mb-2 line-clamp-2">{post.description}</p>

        <div className="d-flex ">
          <PostTypeBadge type={post.postType} />
          <span className="badge badge-lost-or-found-date mb-1">
            <i className="bi-calendar-fill me-1"></i>
             {formatDateVN(post.createdAt)}
          </span>
        </div>

        <div className="d-flex flex-column align-items-start">
          <span className="badge badge-category mb-1">
            <i className="bi-box me-1"></i>
            {post.category?.name}
          </span>
          <span className="badge mb-2">
            <i className="bi-geo-alt me-1"></i>
            {post.location.district}, {post.location.province}
          </span>
        </div>

        <div className="text-success d-flex justify-content-between mt-1">
          <span>
            <i className="bi-clock me-2"></i>
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
              locale: vi,
            })}
          </span>
          {/* <Link to>
            <i className="bi-share me-2"></i>
            Share
          </Link> */}
          <LinkShareFb slug={post.slug}/>
        </div>
      </div>

      <PriorityLabel postLabel={post.postLabel} />

      {/* <div className="social-share d-flex flex-column ms-auto">
        <a href="#" className="badge ms-auto">
          <i className="bi-person-fill"></i>
        </a>
        <a href="#" className="badge ms-auto">
          <i className="bi-bookmark"></i>
        </a>
      </div> */}
    </div>
  );
};

export default PostCard;
