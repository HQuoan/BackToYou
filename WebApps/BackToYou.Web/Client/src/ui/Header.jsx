import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import SearchForm from "./SearchForm";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../features/authentication/useUser";
import { useLogout } from "../features/authentication/useLogout";
import PlaceholderAvatar from "./PlaceholderAvatar";
import NotificationDropdown from "../features/notifications/NotificationDropdown";

function Header() {
  const { isAuthenticated, user } = useUser();
  const { logout } = useLogout();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Xử lý click bên ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Thêm sự kiện click vào document
    document.addEventListener("mousedown", handleClickOutside);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const navbar = document.querySelector(".navbar");

    const handleScroll = () => {
      if (window.scrollY > 200) {
        navbar.classList.add("hidden");
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
        navbar.classList.remove("hidden");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Logo />
        <SearchForm />
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-lg-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/search" className="nav-link">
                Search
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/ai-search" className="nav-link">
                AI Search
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/map" className="nav-link">
                Map
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="ms-4 d-flex align-items-center gap-2 position-relative">
          {isAuthenticated ? (
            <>
              <Link
                to="/listing/create"
                className="btn custom-btn custom-border-btn me-5"
              >
                Đăng bài
              </Link>
              <div className="me-2">
                <NotificationDropdown />
              </div>

              <div className="dropdown" ref={dropdownRef}>
                <div
                  className="profile-dropdown-toggle d-flex align-items-center gap-2 bg-transparent border-0 p-0"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="me-2 text-white">
                    {user?.shortName || user?.fullName || "User"}
                  </span>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      className="profile-block-image"
                      alt="avatar"
                    />
                  ) : (
                    <PlaceholderAvatar name={user?.shortName} />
                  )}
                </div>
                {isDropdownOpen && (
                  <div className="profile-dropdown-menu">
                    <Link
                      to="/account/profile"
                      className="profile-dropdown-item"
                    >
                      <i className="bi bi-person-fill me-2" />
                      Thông tin tài khoản
                    </Link>
                    <Link
                      to="/account/payment"
                      className="profile-dropdown-item"
                    >
                      <i className="bi bi-wallet2 me-2"></i>
                      Ví của bạn
                    </Link>
                    <Link
                      to="/account/history"
                      className="profile-dropdown-item"
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Bài đăng
                    </Link>

                    <Link
                      to="/account/following"
                      className="profile-dropdown-item"
                    >
                      <i className="bi bi-bookmark me-2"></i>
                      Theo dõi
                    </Link>
                    <button
                      className="btn profile-dropdown-item"
                      onClick={() => logout()}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="btn custom-btn custom-border-btn">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
