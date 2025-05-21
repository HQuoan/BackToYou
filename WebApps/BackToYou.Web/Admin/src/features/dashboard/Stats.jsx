import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import Stat from "./Stat";
import { formatVndCurrency } from "../../utils/helpers";

function Stats({ postCount, sales, userCount }) {

  return (
    <>
      <Stat
        title="Posts"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={postCount}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatVndCurrency(sales)}
      />
      <Stat
        title="Users"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={userCount}
      />
      <Stat
        title="Reports"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(1 * 100) + "%"}
      />
    </>
  );
}

export default Stats;
