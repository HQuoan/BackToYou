import { useForm } from "react-hook-form";
import { useUpdatePostUpdateLabelAndStatus } from "./useUpdatePostUpdateLabelAndStatus";
import {
  POST_LABEL_FAKE,
  POST_LABEL_FOUND,
  POST_LABEL_NORMAL,
  POST_LABEL_PRIORITY,
} from "../../utils/constants";
import Form from "../../ui/Form";
import FormRowVertical from "../../ui/FormRowVertical";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";

function ChangeLabelForm({ postId, onCloseModal, isActionLoading }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { updatePostUpdateLabelAndStatus } =
    useUpdatePostUpdateLabelAndStatus();

  const onSubmit = ({ postLabel }) => {
    updatePostUpdateLabelAndStatus({ postId, postLabel });
    reset();
    onCloseModal(); // đóng modal
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRowVertical label="Post Label" error={errors.postLabel?.message}>
        <select
          {...register("postLabel", { required: "Please select a post label" })}
          style={{ padding: "1rem", fontSize: "1.6rem", width: "100%" }}
        >
          <option value="">-- Select Post Label --</option>
          <option value={POST_LABEL_NORMAL}>{POST_LABEL_NORMAL}</option>
          <option value={POST_LABEL_PRIORITY}>{POST_LABEL_PRIORITY}</option>
          <option value={POST_LABEL_FOUND}>{POST_LABEL_FOUND}</option>
          <option value={POST_LABEL_FAKE}>{POST_LABEL_FAKE}</option>
        </select>
      </FormRowVertical>
      <FormRow>
        <Button variation="primary" disabled={isActionLoading} type="submit">
          {isActionLoading ? "Processing..." : "Confirm Change"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default ChangeLabelForm;
