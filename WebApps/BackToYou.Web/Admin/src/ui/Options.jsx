import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function Options({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const option = searchParams.get("option") || "";

  function handleChange(e) {
    searchParams.set("option", e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      type="white"
      value={option}
      onChange={handleChange}
    />
  );
}

export default Options;
