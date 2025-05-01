import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import SearchForm from "./SearchForm";
import { useEffect } from "react";

function Header() {
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
                  <NavLink to="/listing-page" className="dropdown-item">
                    Listing Page
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/detail-page" className="dropdown-item">
                    Detail Page
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="ms-4">
          <Link
            to="/login"
            className="btn custom-btn custom-border-btn smoothscroll"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
