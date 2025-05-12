import "../features/account/Account.css";
import { Outlet } from "react-router-dom";
import AccountHeader from "../features/account/AccountHeader";

function AccountPage() {
  return (
    <>
      <div className="site-header"></div>

      <div className="container header-content-overlay">
        <div className="row min-height-600">
          <AccountHeader />
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AccountPage;
