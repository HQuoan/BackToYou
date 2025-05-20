import styled from "styled-components";
import { useRecentStays } from "./useRecentStays";
import { useRecentBookings } from "./useRecentBookings";
import Spinner from "../../ui/Spinner";
import Stats from "./Stats";
import { useCabins } from "../cabins/useCabins";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";
import CategoryBarChartWrapper from "./CategoryBarChartWrapper";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 43rem auto;
  gap: 2.4rem;
`;

const payment =  {
    "timePeriod": "2025-05-13 to 2025-05-20",
    "dailyTotals": [
      {
        "label": "May 14",
        "totalPayment": 8956668
      },
      {
        "label": "May 15",
        "totalPayment": 10010000
      },
      {
        "label": "May 19",
        "totalPayment": 10000
      }
    ]
  }

function DashboardLayout() {
  const { bookings, isLoading: isLoading1 } = useRecentBookings();
  const { confirmedStays, isLoading: isLoading2, numDays } = useRecentStays();
  const { cabins, isLoading: isLoading3 } = useCabins();

  if (isLoading1 || isLoading2 || isLoading3) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        numDays={numDays}
        cabinCount={cabins.length}
      />
      <TodayActivity />
      <CategoryBarChartWrapper/>
      {/* <DurationChart confirmedStays={confirmedStays} /> */}
      <SalesChart data= {payment}/>
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
