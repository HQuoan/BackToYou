import styled from "styled-components";
import Stats from "./Stats";
import SalesChart from "./SalesChart";
import TodayActivity from "./TodayActivity";
import CategoryBarChartWrapper from "./CategoryBarChartWrapper";
import { usePostsByCategory } from "./usePostsByCategory";
import { usePaymentTotal } from "./usePaymentTotal";
import { useNewUserCount } from "../users/useNewUserCount";
import { useReports } from './../reports/useReports';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 43rem auto;
  gap: 2.4rem;
`;


function DashboardLayout() {
  const { isLoading: loadingPayment, posts, pagination: postPagination } = usePostsByCategory();
  const { isLoading: loadingPosts, paymentTotal, pagination: paymentPagination } = usePaymentTotal();
  const { userCount } = useNewUserCount();

  const {pagination} = useReports();

  return (
    <StyledDashboardLayout>
      <Stats
        postCount = {postPagination?.totalItems}
        sales = {paymentPagination?.totalItems}
        userCount = {userCount}
        reportCount = {pagination?.totalItems}
      />
      <TodayActivity />
      <CategoryBarChartWrapper isLoading={loadingPosts} posts={posts}/>
      <SalesChart isLoading={loadingPayment} data={paymentTotal}/>
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
