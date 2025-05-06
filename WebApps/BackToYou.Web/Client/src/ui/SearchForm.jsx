import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchForm() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?Keyword=${encodeURIComponent(keyword.trim())}`);
    }
  }

  return (
    <form className="custom-form search-form flex-fill me-3" role="search">
      <div className="input-group input-group-lg">
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="form-control"
          placeholder="Search"
        />
        <button type="submit" className="form-control" onClick={handleSubmit}>
          <i className="bi-search"></i>
        </button>
      </div>
    </form>
  );
}

export default SearchForm;