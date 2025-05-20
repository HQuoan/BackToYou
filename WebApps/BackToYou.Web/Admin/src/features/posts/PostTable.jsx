import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";

import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";
import PostRow from "./PostRow";
import { usePosts } from "./usePosts";

function PostTable() {
  const { posts, isLoading, pagination } = usePosts();

  if (isLoading) return <Spinner />;

  if (!posts.length) return <Empty resourceName="posts" />;

  return (
    <Menus>
      <Table columns="0.6fr 2fr 2fr 1.2fr 1.2fr 1.2fr 3.2rem">
        <Table.Header>
          <div></div>
          <div>User</div>
          <div>Title</div>
          <div>Type</div>
          <div>Label</div>
          <div>Status</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={posts}
          render={(post) => <PostRow key={post.postId} post={post} />}
        />

        <Table.Footer>
          <Pagination pagination={pagination} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default PostTable;
