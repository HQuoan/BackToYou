import { useUser } from "../authentication/useUser";
import ChangePasswordForm from "./ChangePasswordForm";
import UpdateInfoForm from "./UpdateInfoForm";

function AccountInfo() {
  const { isPending, user } = useUser();

  return (
    <div className="container mt-4">
      <UpdateInfoForm user={user} isPending={isPending} />
       <div className="my-5" />
      <ChangePasswordForm />
    </div>
  );
}

export default AccountInfo;
