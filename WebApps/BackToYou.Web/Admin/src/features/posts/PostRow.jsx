import styled from "styled-components";
import {
  HiEye,
  HiTrash,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import Modal from "../../ui/Modal";
import Menus from "../../ui/Menus";
import ConfirmDelete from "../../ui/ConfirmDelete";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
  padding: 2px;
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function PostRow({ post }) {
  const navigate = useNavigate();

  return (
    <Table.Row>
      <Img src={post.thumbnailUrl} />

      <Stacked>
        <span>{post?.user?.fullName}</span>
        <span>{post?.user?.email}</span>
      </Stacked>

      <p>{post.title}</p>
      <Tag type={post.postType.toLowerCase()}>{post.postType}</Tag>
      <Tag type={post.postLabel.toLowerCase()}>{post.postLabel}</Tag>
      <Tag type={post.postStatus.toLowerCase()}>{post.postStatus}</Tag>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={post.postId} />
          <Menus.List id={post.postId}>
            <Menus.Button
              icon={<HiEye />}
              onClick={() => navigate(`/posts/${post.slug}`)}
            >
              See details
            </Menus.Button>

           
          </Menus.List>
        </Menus.Menu>

      </Modal>
    </Table.Row>
  );
}

export default PostRow;