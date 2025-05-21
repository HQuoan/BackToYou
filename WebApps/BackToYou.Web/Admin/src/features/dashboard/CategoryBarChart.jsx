import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { useDarkMode } from "../../context/DarkModeContext";
import Heading from "../../ui/Heading";
import { useSearchParams } from "react-router-dom";

const ChartBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 3.2rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }
`;

/* Bảng màu cho các danh mục */
const categoryColors = [
  { name: "Giấy tờ tùy thân", light: "#ef4444", dark: "#b91c1c" },
  { name: "Người thân", light: "#f97316", dark: "#c2410c" },
  { name: "Thú cưng", light: "#a855f7", dark: "#7e22ce" },
  { name: "Trang sức", light: "#eab308", dark: "#a16207" },
  { name: "Thiết bị điện tử", light: "#3b82f6", dark: "#1d4ed8" },
  { name: "Xe cộ", light: "#22c55e", dark: "#15803d" },
  { name: "Khác", light: "#14b8a6", dark: "#0f766e" },
];

function prepareData(postsByCategory) {
  if (!postsByCategory) return [];

  const backendMap = new Map(
    postsByCategory.categories.map((c) => [c.categoryName, c.postCount])
  );

  // Lấy toàn bộ danh mục từ categoryColors
  const fullData = categoryColors.map(({ name }) => ({
    category: name,
    count: backendMap.get(name) ?? 0,
  }));

  // Sắp xếp giảm dần theo count
  return fullData.sort((a, b) => b.count - a.count);
}

function CategoryBarChart({ postsByCategory }) {
  const { isDarkMode } = useDarkMode();

  const [searchParams] = useSearchParams();
  const numDays = Number(searchParams.get("last")) || 7;

  const data = prepareData(postsByCategory);

  return (
    <ChartBox>
      <Heading as="h2">{`Posts by category (last ${numDays} days)`}</Heading>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          barCategoryGap={30} // giãn cách cột
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-grey-300)" />

          <XAxis
            dataKey="category"
            tick={false}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={10}
            stroke="var(--color-grey-700)"
          />

          <YAxis stroke="var(--color-grey-700)" />

          <Tooltip
            formatter={(value) => [`${value} bài`, "Số bài đăng"]}
            contentStyle={{
              backgroundColor: "var(--color-grey-0)",
              border: "1px solid var(--color-grey-100)",
              borderRadius: "var(--border-radius-sm)",
              fontSize: "1.4rem",
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "1.2rem",
              lineHeight: "1.6",
            }}
            payload={categoryColors.map((c, i) => ({
              id: c.name,
              value: c.name,
              type: "square",
              color: isDarkMode ? c.dark : c.light,
            }))}
          />

          {/* Mỗi bản ghi chỉ có 1 trường count nên dùng 1 <Bar> kèm <Cell> để tô màu từng cột */}
          <Bar dataKey="count" barSize={40}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  isDarkMode
                    ? categoryColors[index].dark
                    : categoryColors[index].light
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>


    </ChartBox>
  );
}

export default CategoryBarChart;
