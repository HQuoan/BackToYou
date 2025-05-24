import { useForm } from "react-hook-form";
import { useUpdatePostUpdateLabelAndStatus } from "./useUpdatePostUpdateLabelAndStatus";
import { POST_STATUS_REJECTED } from "../../utils/constants";
import Form from "../../ui/Form";
import FormRowVertical from "../../ui/FormRowVertical";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";

function RejectForm({ postId, onCloseModal, isActionLoading }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { updatePostUpdateLabelAndStatus } = useUpdatePostUpdateLabelAndStatus();

  const onSubmit = ({ reason }) => {
    updatePostUpdateLabelAndStatus({
      postId,
      postStatus: POST_STATUS_REJECTED,
      rejectionReason: reason,
    });
    reset();
    onCloseModal();            // đóng modal
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRowVertical label="Rejection Reason" error={errors.reason?.message}>
        <Textarea
          rows={4}
          placeholder="Please provide the reason for rejection..."
          style={{ width: 500, height: 200 }}
          {...register("reason", {
            required: "Reason is required",
            minLength: { value: 10, message: "At least 10 characters" },
          })}
        />
      </FormRowVertical>
      <FormRow>
        <Button variation="danger" disabled={isActionLoading} type="submit">
          {isActionLoading ? "Processing..." : "Confirm Reject"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default RejectForm;