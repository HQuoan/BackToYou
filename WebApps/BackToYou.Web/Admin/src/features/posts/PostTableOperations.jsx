import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";
import { POST_STATUS_APPROVED, POST_STATUS_PENDING, POST_STATUS_PROCESSING, POST_STATUS_REJECTED } from "../../utils/constants";

function PostTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: POST_STATUS_PENDING, label: "Pending" },
          { value: POST_STATUS_PROCESSING, label: "Processing" },
          { value: POST_STATUS_APPROVED, label: "Approved" },
          { value: POST_STATUS_REJECTED, label: "Rejected" },
        ]}
      />

      <SortBy
        options={[
          { value: "-createdAt", label: "Sort by date (recent first)" },
          { value: "createdAt", label: "Sort by date (earlier first)" },
        ]}
      />
    </TableOperations>
  );
}

export default PostTableOperations;
