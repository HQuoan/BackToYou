function SearchForm() {
  return (
    <form className="custom-form search-form flex-fill me-3" role="search">
      <div className="input-group input-group-lg">
        <input type="search" className="form-control" placeholder="Search" />
        <button type="submit" className="form-control">
          <i className="bi-search"></i>
        </button>
      </div>
    </form>
  );
}

export default SearchForm;
