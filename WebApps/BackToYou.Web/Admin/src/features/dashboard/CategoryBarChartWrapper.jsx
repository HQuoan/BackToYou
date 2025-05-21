import { useSearchParams } from "react-router-dom";
import Spinner from "../../ui/Spinner";
import CategoryBarChart from "./CategoryBarChart";
import styled from "styled-components";

const StyledChart = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  grid-column: 3 / span 2;
  padding-top: 2.4rem;
`;

const NoData = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;
`;

function CategoryBarChartWrapper({ isLoading, posts }) {
  const [searchParams] = useSearchParams();
  const numDays = Number(searchParams.get("last")) || 7;

  if (isLoading)
    return (
      <StyledChart>
        <Spinner />
      </StyledChart>
    );
  if (!posts)
    return (
      <StyledChart>
        <NoData>{`No posts in the past ${numDays} days...`}</NoData>
      </StyledChart>
    );

  return <CategoryBarChart postsByCategory={posts} />;
}

export default CategoryBarChartWrapper;
