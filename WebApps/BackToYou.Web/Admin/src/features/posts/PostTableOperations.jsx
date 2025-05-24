import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";
import {
  POST_LABEL_FAKE,
  POST_LABEL_FOUND,
  POST_LABEL_NORMAL,
  POST_LABEL_PRIORITY,
  POST_STATUS_APPROVED,
  POST_STATUS_PENDING,
  POST_STATUS_PROCESSING,
  POST_STATUS_REJECTED,
} from "../../utils/constants";
import Options from "../../ui/Options";
import { useSearchParams } from "react-router-dom";
import SearchInput from "../../ui/SearchInput";

function PostTableOperations() {
  const [searchParams] = useSearchParams();
  const option = searchParams.get("option") || "";

  return (
    <TableOperations>
      <SearchInput searchField="email" placeholder="Search by email..." />

      <Options
        options={[
          { value: "status", label: "Status" },
          { value: "label", label: "Label" },
        ]}
      />

      {option === "label" ? (
        <Filter
          filterField="label"
          options={[
            { value: "all", label: "All" },
            { value: POST_LABEL_NORMAL, label: "Normal" },
            { value: POST_LABEL_PRIORITY, label: "Priority" },
            { value: POST_LABEL_FOUND, label: POST_LABEL_FOUND },
            { value: POST_LABEL_FAKE, label: POST_LABEL_FAKE },
          ]}
        />
      ) : (
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
      )}

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
