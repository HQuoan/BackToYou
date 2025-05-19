import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import { useChangePassword } from "./useChangePassword";

function UpdatePasswordForm() {
  const { register, handleSubmit, formState, getValues, reset } = useForm();
  const { errors } = formState;

  const { isLoading, changePassword } = useChangePassword();

  function onSubmit(data) {
    changePassword(data, { onSuccess: reset });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="Current password"
        error={errors?.currentPassword?.message}
      >
        <Input
          type="password"
          id="currentPassword"
          disabled={isLoading}
          {...register("currentPassword", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow
        label="New password (min 8 chars)"
        error={errors?.newPassword?.message}
      >
        <Input
          type="password"
          id="newPassword"
          disabled={isLoading}
          {...register("newPassword", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Confirm password"
        error={errors?.confirmNewPassword?.message}
      >
        <Input
          type="password"
          id="confirmNewPassword"
          disabled={isLoading}
          {...register("confirmNewPassword", {
            required: "This field is required",
            validate: (value) =>
              getValues().newPassword === value || "Passwords need to match",
          })}
        />
      </FormRow>
      <FormRow>
        <Button onClick={reset} type="reset" variation="secondary">
          Cancel
        </Button>
        <Button disabled={isLoading}>Update password</Button>
      </FormRow>
    </Form>
  );
}

export default UpdatePasswordForm;
