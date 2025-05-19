import { POST_TYPE_LOST } from "../utils/constants";

const PostTypeBadge = ({ type }) => {
  const isLost = type === POST_TYPE_LOST;
  const badgeClass = isLost ? "badge-lost" : "badge-found";
  const label = isLost ? "Báo mất" : "Nhặt được";

  return <span className={`badge ${badgeClass} mb-1`}>
          <i className="bi-tag me-1"></i>
          {label}
        </span>;
};

export default PostTypeBadge;
