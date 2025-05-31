import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatDateTimeVN } from "../../utils/helpers";
import { useMyNotifications } from "./useMyNotifications";
import Spinner from "./../../ui/Spinner";
import { useMarkAsRead } from "./useMarkAsRead";

function NotificationDropdown() {
  const [pageNumber, setPageNumber] = useState(1);
  const [notificationList, setNotificationList] = useState([]);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [isRead, setIsRead] = useState(undefined); // undefined là tất cả , false là chưa độc

  const { isPending, pagination, notifications } = useMyNotifications(
    pageNumber,
    { IsRead: isRead }
  );
  const { markAsRead } = useMarkAsRead();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const hasMorePages = pagination && pageNumber < pagination.totalPages;

  const handleLoadMore = () => setPageNumber((prev) => prev + 1);

  // Cập nhật danh sách bình luận
  useEffect(() => {
    if (!notifications || notifications.length === 0) return;

    if (pageNumber === 1) {
      setNotificationList(notifications);
    } else {
      setNotificationList((prevNotifications) => {
        const existingIds = new Set(
          prevNotifications.map((c) => c.notificationId)
        );
        const newComments = notifications.filter(
          (c) => !existingIds.has(c.notificationId)
        );
        return [...prevNotifications, ...newComments];
      });
    }
  }, [notifications, pageNumber]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Thay thế handler trong nút filter
  const handleFilterClick = (status) => {
    setStatusFilter(status);
    setIsRead(status === "Tất cả" ? undefined : false);

    // reset
    setPageNumber(1);
    setNotificationList([]);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="notification-dropdown-toggle bg-transparent border-0 p-0"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer" }}
      >
        <i className="bi bi-bell"></i>
        {notificationList.some((notif) => !notif.isRead) && (
          <span className="notification-badge"></span>
        )}
      </button>
      {isOpen && (
        <div className="notification-dropdown-menu">
          <div className="receipts-filter-nav notification account-nav">
            {["Tất cả", "Chưa đọc"].map((status) => (
              <button
                key={status}
                onClick={() => handleFilterClick(status)}
                className={`nav-link ${
                  statusFilter === status ||
                  (status === "Tất cả" && !statusFilter)
                    ? "active"
                    : ""
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          {isPending ? (
            <Spinner />
          ) : notificationList.length === 0 ? (
            <div className="notification-dropdown-item notification-empty">
              Không có thông báo
            </div>
          ) : (
            notificationList.map((notification) => (
              <Link
                key={notification.notificationId}
                to={notification.url}
                className={`notification-dropdown-item ${
                  notification.isRead ? "" : "notification-unread"
                }`}
                onClick={() => markAsRead(notification.notificationId)}
              >
                <div className="notification-content">
                  <div className="notification-title">
                    {notification.title}
                    {!notification.isRead && (
                      <span className="notification-unread-dot"></span>
                    )}
                  </div>
                  <div className="notification-message">
                    {notification.message}
                  </div>
                  <div className="notification-time">
                    {formatDateTimeVN(notification.createdAt)}
                  </div>
                </div>
              </Link>
            ))
          )}

          {hasMorePages && (
            <div className="d-flex justify-content-end mt-2 me-2">
              <span
                className="load-more-text"
                onClick={handleLoadMore}
                disabled={isPending}
              >
                {isPending ? "Đang tải..." : "Xem thêm"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;
