import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

import PostDataBox from "./PostDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Empty from "../../ui/Empty";
import { useMoveBack } from "../../hooks/useMoveBack";
import { usePost } from "./usePost";
import { POST_STATUS_APPROVED, POST_STATUS_PENDING, POST_STATUS_PROCESSING, POST_STATUS_REJECTED } from './../../utils/constants';
import { useUpdatePostUpdateLabelAndStatus } from "./useUpdatePostUpdateLabelAndStatus";
import ConfirmReject from "../../ui/ConfirmReject";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function PostDetail() {
  const moveBack = useMoveBack();
  const navigate = useNavigate();

  const { slug } = useParams();
  const { post, isLoading } = usePost(slug);
  
  const {isLoading: isUpdating, updatePostUpdateLabelAndStatus}  = useUpdatePostUpdateLabelAndStatus();
  if (isLoading) return <Spinner />;
  if (!post) return <Empty resourceName="post" />;

  const { postStatus, postId } = post;


  function handleChangePostStatus(status){
    updatePostUpdateLabelAndStatus({postId: postId, postStatus: status})
  }

  const statusToTagName = {
    Pending: "blue",
    Approved: "green",
    Rejected: "silver",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Post #{postId}</Heading>
          <Tag type={statusToTagName[postStatus]}>{postStatus}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>← Back</ButtonText>
      </Row>

      <PostDataBox post={post} />

      <ButtonGroup>
        {/* {postStatus === POST_STATUS_PENDING && (
          <Button onClick={() => handleChangePostStatus(POST_STATUS_PROCESSING)} disabled={isUpdating}>
            Process
          </Button>
        )} */}

         <Button onClick={() => handleChangePostStatus(POST_STATUS_PROCESSING)} disabled={isUpdating}>
            Process
          </Button>

         {postStatus === POST_STATUS_PROCESSING && (<>
          <Button variation="success" onClick={() => handleChangePostStatus(POST_STATUS_APPROVED)} disabled={isUpdating}>
            Approve
          </Button>

          <Modal>
          <Modal.Open opens="reject">
            <Button variation="danger">Reject</Button>
          </Modal.Open>

          <Modal.Window name="reject">
            <ConfirmReject
              resourceName="post"
              disabled={isUpdating}
              onConfirm={() =>
               handleChangePostStatus(POST_STATUS_REJECTED)
              }
            />
          </Modal.Window>
        </Modal></>
        )}

        

        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default PostDetail;
