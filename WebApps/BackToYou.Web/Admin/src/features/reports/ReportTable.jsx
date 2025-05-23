import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";

import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";
import ReportRow from "./ReportRow";
import { useReports } from "./useReports";

function ReportTable() {
  const {isLoading, reports, pagination } = useReports();

  if (isLoading) return <Spinner />;

  if (!reports.length) return <Empty resourceName="reports" />;


  return (
    <Menus>
      <Table columns="1fr 1fr 3fr 1fr 3.2rem">
        <Table.Header>
          <div>User</div>
          <div>Title</div>
          <div>Description</div>
          <div>Status</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={reports}
          render={(report) => (
            <ReportRow key={report.reportId} report={report} />
          )}
        />

        <Table.Footer>
          <Pagination pagination={pagination} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default ReportTable;
