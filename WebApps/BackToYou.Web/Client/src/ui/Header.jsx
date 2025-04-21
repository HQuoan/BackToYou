import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import SearchForm from "./SearchForm";
import { useEffect } from "react";

function Header() {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

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
  
    handleScroll(); // Đảm bảo navbar đúng trạng thái ngay khi mount
  
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
              <Link className={getLinkClass("/")} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClass("/map")} to="/map">
                Map
              </Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClass("/search")} to="/search">
                Search
              </Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClass("/ai-search")} to="/ai-search">
                AI Search
              </Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClass("/contact")} to="/contact">
                Contact
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Pages
              </a>
              <ul className="dropdown-menu dropdown-menu-light">
                <li>
                  <a className="dropdown-item" href="/listing-page">
                    Listing Page
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/detail-page">
                    Detail Page
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <div className="ms-4">
            <a
              href="#section_3"
              className="btn custom-btn custom-border-btn smoothscroll"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
