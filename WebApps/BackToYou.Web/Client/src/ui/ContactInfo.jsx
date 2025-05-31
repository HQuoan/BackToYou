import toast from "react-hot-toast";
import { formatPhoneNumber } from "../utils/helpers";
import { useUser } from "../features/authentication/useUser";
import { useCreateFollower } from "../features/follower/useCreateFollower";
import { useDeleteFollower } from "../features/follower/useDeleteFollower";
import { useUpdateFollower } from "../features/follower/useUpdateFollower";
import { useIsFollower } from "../features/follower/useIsFollower";

function ContactInfo({ post, onReport }) {
  const { user, isAuthenticated } = useUser();
  const { isCreating, createFollower } = useCreateFollower();
  const { isDeleting, deleteFollower } = useDeleteFollower();
  const { isUpdating, updateFollower } = useUpdateFollower();
  const { isPending, follower } = useIsFollower(post.postId);

  const handleReport = () => {
    if (!user) toast.error("Vui lòng đăng nhập để dùng chức năng này!");
    else onReport();
  };

  return (
    <div className="row profile-block profile-detail-block d-flex flex-wrap align-items-center mt-5">
      <div className="col-md-6">
        <h5>Thông tin liên hệ</h5>
        <p>
          <strong>Tên: {post.postContact.name ?? "Unknown"}</strong>
          <strong>
            Phone: {formatPhoneNumber(post.postContact.phone ?? "Unknown")}
          </strong>
          <strong>
            Email: {formatPhoneNumber(post.postContact.email ?? "Unknown")}
          </strong>
        </p>
      </div>
      <div className="col-md-6 mb-4 d-flex flex-column align-items-end">
        <div className="d-flex mb-2">
          <button onClick={handleReport} className="btn custom-btn me-2">
            Báo cáo
          </button>

          {isAuthenticated &&
            (follower ? (
              <div className="dropdown">
                <button
                  className="btn custom-btn dropdown-toggle"
                  type="button"
                  id="followerDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {follower.isSubscribed ? (
                    <i className="bi bi-bell-fill me-3" />
                  ) : (
                    <i className="bi bi-bell-slash-fill me-3" />
                  )}
                  Đã theo dõi
                </button>
                <ul className="dropdown-menu" aria-labelledby="followerDropdown">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => deleteFollower(follower.followerId)}
                    >
                      <i className="bi bi-person-x me-2" />
                      Hủy theo dõi
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() =>
                        updateFollower({
                          followerId: follower.followerId,
                          isSubscribed: true,
                        })
                      }
                    >
                      <i className="bi bi-bell me-2" />
                      Tất cả
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() =>
                        updateFollower({
                          followerId: follower.followerId,
                          isSubscribed: false,
                        })
                      }
                    >
                      <i className="bi bi-bell-slash me-2" /> Không nhận thông báo
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                onClick={() => createFollower(post.postId)}
                className="btn custom-btn"
              >
                Theo dõi
              </button>
            ))}
        </div>

        <ul className="social-icon d-flex">
          {post.postContact?.facebook && (
            <li className="social-icon-item">
              <a
                href={post.postContact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-link"
              >
                <i className="bi bi-facebook"></i>
              </a>
            </li>
          )}
          <li className="social-icon-item">
            <a
              href={`https://mail.google.com/mail/u/0/?view=cm&to=${post.postContact?.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
            >
              <i className="bi bi-envelope"></i>
            </a>
          </li>
          <li className="social-icon-item">
            <a
              href={`tel:${post.postContact?.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
            >
              <i className="bi bi-whatsapp"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}


export default ContactInfo;
