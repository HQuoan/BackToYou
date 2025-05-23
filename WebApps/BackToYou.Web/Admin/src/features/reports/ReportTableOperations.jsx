import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";
import {
  POST_STATUS_APPROVED,
  POST_STATUS_PENDING,
  POST_STATUS_PROCESSING,
  POST_STATUS_REJECTED,
  REPORT_TITLES,
} from "../../utils/constants";
import SearchInput from "../../ui/SearchInput";
import styled from "styled-components";

const OperationGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

function ReportTableOperations() {
  return (
    <TableOperations
      style={{ justifyContent: "space-between", flexWrap: "wrap" }}
    >
      <OperationGroup>
        <SearchInput searchField="email" placeholder="Search by email..." />
        <SortBy
          options={[
            { value: "-createdAt", label: "Sort by date (recent first)" },
            { value: "createdAt", label: "Sort by date (earlier first)" },
          ]}
        />
      </OperationGroup>

      <OperationGroup>
        <div>
          <Filter
            filterField="title"
            options={[
              { value: "all", label: "All" },
              {
                value: REPORT_TITLES.FAKE_REPORT,
                label: REPORT_TITLES.FAKE_REPORT,
              },
              {
                value: REPORT_TITLES.REQUEST_REMOVE_POST,
                label: REPORT_TITLES.REQUEST_REMOVE_POST,
              },
              { value: REPORT_TITLES.FEEDBACK, label: REPORT_TITLES.FEEDBACK },
              {
                value: REPORT_TITLES.CLAIM_OWNER,
                label: REPORT_TITLES.CLAIM_OWNER,
              },
              {
                value: REPORT_TITLES.FOUND_LOST_ITEM,
                label: REPORT_TITLES.FOUND_LOST_ITEM,
              },
            ]}
          />
        </div>
        <div>
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
        </div>
      </OperationGroup>
    </TableOperations>
  );
}

export default ReportTableOperations;
