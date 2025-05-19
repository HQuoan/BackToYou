import { useState } from "react";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";

import { useUser } from "./useUser";
import { useUpdateInfo } from "./useUpdateInfo";
import { useUploadAvatar } from "./useUploadAvatar";

function UpdateUserDataForm() {
  const { isLoading, user } = useUser();
  const { uploadAvatar, isLoading: uploading } = useUploadAvatar();
  const { updateInfo, isLoading: updating } = useUpdateInfo();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [avatar, setAvatar] = useState(null);

  if (isLoading) return <Spinner />;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAvatar(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName) return;

    updateInfo(
      { fullName, phoneNumber },
      {
        onSuccess: () => setAvatar(null),
      }
    );
  };

  const handleCancel = () => {
    setFullName(user?.fullName || "");
    setPhoneNumber(user?.phoneNumber || "");
    setAvatar(null);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={user?.email} disabled />
      </FormRow>

      <FormRow label="Full name">
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={updating}
        />
      </FormRow>

      <FormRow label="Phone number">
        <Input
          id="phoneNumber"
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={updating}
        />
      </FormRow>

      <FormRow label="Avatar image">
        <>
          <FileInput
            id="avatar"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            // hidden={uploading}
          />
          {uploading && <span>Uploading...</span>}
        </>
      </FormRow>

      <FormRow>
        <Button
          type="reset"
          variation="secondary"
          disabled={updating}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button disabled={updating}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
