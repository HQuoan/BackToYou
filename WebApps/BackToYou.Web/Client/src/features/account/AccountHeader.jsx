import { NavLink } from "react-router-dom";

function AccountHeader() {
  return (
    <div className="account-header">
      <div className="account-nav">
        <NavLink to="/account/profile" className="nav-link">
          <i className="bi bi-person-fill"></i> Thông tin tài khoản
        </NavLink>
        <NavLink to="/account/payment" className="nav-link">
          <i className="bi bi-wallet2 me-2"></i>
          Ví của bạn
        </NavLink>

        <NavLink to="/account/change-password" className="nav-link">
          <i className="bi bi-shield-lock"></i> Đổi mật khẩu
        </NavLink>
        <NavLink to="/account/history" className="nav-link">
          <i className="bi bi-pencil-square"></i> Bài đăng
        </NavLink>
        <NavLink to="/account/following" className="nav-link">
          <i className="bi bi-bookmark"></i> Theo dõi
        </NavLink>
      </div>
    </div>
  );
}

export default AccountHeader;
