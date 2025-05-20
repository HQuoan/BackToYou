import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import PostDataBox from "./PostDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Modal from "../../ui/Modal";
import Empty from "../../ui/Empty";
import Form from "../../ui/Form";
import FormRowVertical from "../../ui/FormRowVertical";
import Textarea from "../../ui/Textarea";
import { useMoveBack } from "../../hooks/useMoveBack";
import { usePost } from "./usePost";
import {
  POST_STATUS_APPROVED,
  POST_STATUS_PROCESSING,
  POST_STATUS_REJECTED,
} from "../../utils/constants";
import { useUpdatePostUpdateLabelAndStatus } from "./useUpdatePostUpdateLabelAndStatus";
import { useCreateEmbedding } from "../embeddings/useCreateEmbedding";
import { useDeleteEmbedding } from "../embeddings/useDeleteEmbedding";
import FormRow from "../../ui/FormRow";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function PostDetail() {
  const { slug } = useParams();
  const { post, isLoading } = usePost(slug);
  const { isLoading: isUpdating, updatePostUpdateLabelAndStatus } =
    useUpdatePostUpdateLabelAndStatus();
  const { isLoading: isCreateEmbedding, createEmbedding } =
    useCreateEmbedding();
  const { isLoading: isDeleteEmbedding, deleteEmbedding } =
    useDeleteEmbedding();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const moveBack = useMoveBack();

  const isActionLoading = isUpdating || isCreateEmbedding || isDeleteEmbedding;

  if (isLoading) return <Spinner />;
  if (!post) return <Empty resourceName="post" />;

  const { postStatus, postId, isEmbedded } = post;

  const handleChangePostStatus = (status) => {
    updatePostUpdateLabelAndStatus({ postId, postStatus: status });
  };

  const handleReject = ({ reason }) => {
    updatePostUpdateLabelAndStatus({
      postId,
      postStatus: POST_STATUS_REJECTED,
      rejectionReason: reason,
    });
    reset();
  };

  const renderActionButtons = () => (
    <ButtonGroup>
      {postStatus === POST_STATUS_APPROVED && !isEmbedded && (
        <Button
          onClick={() => createEmbedding(postId)}
          disabled={isActionLoading}
        >
          {isCreateEmbedding ? "Processing..." : "Extract"}
        </Button>
      )}

      {postStatus === POST_STATUS_REJECTED && isEmbedded && (
        <Button
          onClick={() => deleteEmbedding(postId)}
          disabled={isActionLoading}
        >
          {isDeleteEmbedding ? "Processing..." : "Delete Embedding"}
        </Button>
      )}

      {postStatus !== POST_STATUS_PROCESSING && (
        <Button
          onClick={() => handleChangePostStatus(POST_STATUS_PROCESSING)}
          disabled={isActionLoading}
        >
          Process
        </Button>
      )}

      {postStatus === POST_STATUS_PROCESSING && (
        <>
          <Button
            variation="success"
            onClick={() => handleChangePostStatus(POST_STATUS_APPROVED)}
            disabled={isActionLoading}
          >
            Approve
          </Button>

          <Modal>
            <Modal.Open opens="reject">
              <Button variation="danger" disabled={isActionLoading}>
                Reject
              </Button>
            </Modal.Open>

            <Modal.Window name="reject">
              <Form onSubmit={handleSubmit(handleReject)}>
                <FormRowVertical
                  label="Rejection Reason"
                  error={errors.reason?.message}
                >
                  <Textarea
                    style={{ width: "500px", height: "200px" }}
                    rows={4}
                    placeholder="Please provide the reason for rejection..."
                    {...register("reason", {
                      required: "Reason is required",
                      minLength: {
                        value: 10,
                        message: "Reason must be at least 10 characters",
                      },
                    })}
                  />
                </FormRowVertical>

                <FormRow>
                  <Button
                    variation="danger"
                    disabled={isActionLoading}
                    type="submit"
                  >
                    {isActionLoading ? "Processing..." : "Confirm Reject"}
                  </Button>
                </FormRow>
              </Form>
            </Modal.Window>
          </Modal>
        </>
      )}

      <Button
        variation="secondary"
        onClick={moveBack}
        disabled={isActionLoading}
      >
        Back
      </Button>
    </ButtonGroup>
  );

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Post #{postId}</Heading>
          <Tag type={postStatus.toLowerCase()}>{postStatus}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>← Back</ButtonText>
      </Row>

      <PostDataBox post={post} />

      {renderActionButtons()}
    </>
  );
}

export default PostDetail;
