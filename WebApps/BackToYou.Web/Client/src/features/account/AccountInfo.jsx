import ChangePasswordForm from "./ChangePasswordForm";
import UpdateInfoForm from "./UpdateInfoForm";

function AccountInfo() {
  return (
    <div className="container mt-4">
      <UpdateInfoForm />
      <div className="my-5" />
      <ChangePasswordForm />
    </div>
  );
}

export default AccountInfo;
