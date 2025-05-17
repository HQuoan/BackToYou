import CategoryTable from "../features/categories/CategoryTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Categories() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All categories</Heading>
      </Row>

      <Row>
        <CategoryTable />
      </Row>
    </>
  );
}

export default Categories;
