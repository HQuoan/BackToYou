const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <a className="navbar-brand me-lg-5 me-0" href="/">
          <div className="custom-logo-image">
            <img
              src="/images/logo2.png"
              className="logo-image img-fluid"
              alt="logo"
            />
          </div>
        </a>
        <form className="custom-form search-form flex-fill me-3" role="search">
          <div className="input-group input-group-lg">
            <input
              type="search"
              className="form-control"
              placeholder="Search"
            />
            <button type="submit" className="form-control">
              <i className="bi-search"></i>
            </button>
          </div>
        </form>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-lg-auto">
            <li className="nav-item">
              <a className="nav-link active" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about">
                About
              </a>
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
            <li className="nav-item">
              <a className="nav-link" href="/contact">
                Contact
              </a>
            </li>
          </ul>
          <div className="ms-4">
            <a
              href="#section_3"
              className="btn custom-btn custom-border-btn smoothscroll"
            >
              Get started
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
