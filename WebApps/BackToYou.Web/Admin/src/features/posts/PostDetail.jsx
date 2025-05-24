import styled from "styled-components";
import { useParams } from "react-router-dom";

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
import RejectForm from "./RejectForm";
import ChangeLabelForm from "./ChangeLabelForm";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeletePost } from "./useDeletePost";

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
  const { isDeleting, deletePost } = useDeletePost();

  const moveBack = useMoveBack();
  const isActionLoading = isUpdating || isCreateEmbedding || isDeleteEmbedding;

  if (isLoading) return <Spinner />;
  if (!post) return <Empty resourceName="post" />;

  const { postStatus, postId, isEmbedded } = post;

  const renderActions = () => (
    <ButtonGroup>
      {(postStatus === POST_STATUS_APPROVED ||
        postStatus === POST_STATUS_REJECTED) && (
        <>
          {!isEmbedded && (
            <Button
              onClick={() => createEmbedding(postId)}
              disabled={isActionLoading}
            >
              {isCreateEmbedding ? "Processing..." : "Extract"}
            </Button>
          )}

          {isEmbedded && (
            <Button
              onClick={() => deleteEmbedding(postId)}
              disabled={isActionLoading}
            >
              {isDeleteEmbedding ? "Processing..." : "Delete Embedding"}
            </Button>
          )}
        </>
      )}
      {postStatus !== POST_STATUS_PROCESSING && (
        <Button
          onClick={() =>
            updatePostUpdateLabelAndStatus({
              postId,
              postStatus: POST_STATUS_PROCESSING,
            })
          }
          disabled={isActionLoading}
        >
          Process
        </Button>
      )}
      {postStatus === POST_STATUS_PROCESSING && (
        <>
          <Button
            variation="success"
            onClick={() =>
              updatePostUpdateLabelAndStatus({
                postId,
                postStatus: POST_STATUS_APPROVED,
              })
            }
            disabled={isActionLoading}
          >
            Approve
          </Button>

          <Modal>
            {/* ------- Reject modal ------- */}
            <Modal.Open opens="reject">
              <Button variation="danger" disabled={isActionLoading}>
                Reject
              </Button>
            </Modal.Open>
            <Modal.Window name="reject">
              <RejectForm postId={postId} isActionLoading={isActionLoading} />
            </Modal.Window>

            {/* ------- Change label modal ------- */}
            <Modal.Open opens="label">
              <Button variation="primary" disabled={isActionLoading}>
                Change label
              </Button>
            </Modal.Open>
            <Modal.Window name="label">
              <ChangeLabelForm
                postId={postId}
                isActionLoading={isActionLoading}
              />
            </Modal.Window>
          </Modal>
        </>
      )}

      <Modal>
        <Modal.Open opens="delete">
          <Button variation="danger" disabled={isActionLoading}>
            Delete
          </Button>
        </Modal.Open>

        <Modal.Window name="delete">
          <ConfirmDelete
            resourceName="post"
            disabled={isDeleting}
            onConfirm={async (close) => {
              await deletePost(postId);
              close();
            }}
          />
        </Modal.Window>
      </Modal>
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

      {renderActions()}
    </>
  );
}

export default PostDetail;
