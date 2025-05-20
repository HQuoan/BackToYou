import TableOperations from "../../ui/TableOperations";
import SearchInput from "../../ui/SearchInput";

function UserTableOperations() {

  return (
    <TableOperations>
      <SearchInput searchField="email" placeholder="Search by email..." />
    </TableOperations>
  );
}

export default UserTableOperations;
