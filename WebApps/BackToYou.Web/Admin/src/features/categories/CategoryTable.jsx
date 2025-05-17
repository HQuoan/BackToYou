import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import mockCategories from "../../data/mockCategories";
import CategoryRow from "./CategoryRow";

function CategoryTable() {

  const categories  = mockCategories;

  return (
    <Menus>
      <Table columns="1fr 2fr 2fr">
        <Table.Header>
          <div></div>
          <div>Category</div>
          <div>Slug</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={categories}
          render={(category) => <CategoryRow category={category} key={category.categoryId} />}
        />
      </Table>
    </Menus>
  );
}

export default CategoryTable;
