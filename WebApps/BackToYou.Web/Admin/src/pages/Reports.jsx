import Heading from "../ui/Heading";
import Row from "../ui/Row";
import ReportTable from "../features/reports/ReportTable";
import ReportTableOperations from "../features/reports/ReportTableOperations";

function Reports() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All reports</Heading>
        <ReportTableOperations />
      </Row>

      <ReportTable />
    </>
  );
}

export default Reports;
