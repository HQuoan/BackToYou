import Heading from "../ui/Heading";
import Row from "../ui/Row";
import PostTable from './../features/posts/PostTable';
import PostTableOperations from "../features/posts/PostTableOperations";

function Posts() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All posts</Heading>
        <PostTableOperations />
      </Row>

      <PostTable />
    </>
  );
}

export default Posts;
