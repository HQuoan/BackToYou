import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link  to="/" className="navbar-brand me-lg-5 me-0">
      <div className="custom-logo-image">
        <img
          src="/images/logo2.png"
          className="logo-image img-fluid"
          alt="logo"
        />
      </div>
    </Link>
  );
}

export default Logo;
