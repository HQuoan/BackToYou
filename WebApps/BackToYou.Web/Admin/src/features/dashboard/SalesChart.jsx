import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDarkMode } from "../../context/DarkModeContext";
import { eachDayOfInterval, format, parse } from "date-fns";
import { formatVndCurrency } from "../../utils/helpers";
import Spinner from "../../ui/Spinner";


const NoData = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;
`;

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function SalesChart({ isLoading, data }) {
  const { isDarkMode } = useDarkMode();

  if (isLoading)
    return (
      <StyledSalesChart>
        <Spinner />
      </StyledSalesChart>
    );

  if(!data) return <StyledSalesChart><NoData>No data.</NoData></StyledSalesChart>

  // Parse the timePeriod to get start and end dates
  const [startDateStr, endDateStr] = data.timePeriod.split(" to ");
  const startDate = parse(startDateStr, "yyyy-MM-dd", new Date());
  const endDate = parse(endDateStr, "yyyy-MM-dd", new Date());

  // Generate all dates in the interval
  const allDates = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Map dates to chart data, filling in 0 for missing days
  const chartData = allDates.map((date) => {
    const formattedDate = format(date, "MMM dd");
    const dailyTotal = data.dailyTotals.find(
      (entry) => entry.label === format(date, "MMM dd")
    );
    return {
      label: formattedDate,
      totalSales: dailyTotal ? dailyTotal.totalPayment : 0,
    };
  });

  const colors = isDarkMode
    ? {
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        text: "#374151",
        background: "#fff",
      };

  return (
    <StyledSalesChart>
      <Heading as="h2">
        Sales from {format(startDate, "MMM dd yyyy")} —{" "}
        {format(endDate, "MMM dd yyyy")}
      </Heading>

      <ResponsiveContainer height={300} width="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, bottom: 20, left: 60 }}
        >
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            tickFormatter={(value) => formatVndCurrency(value)}
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip
            formatter={(value) => [formatVndCurrency(value), "Total sales"]}
            contentStyle={{ backgroundColor: colors.background }}
          />
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Total sales"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
