import { useSearchParams } from "react-router-dom";
import "./Pagination.css";
import { getVisiblePages } from "../utils/helpers";

const PAGE_SIZE = 9;

function Pagination({ pageSize = PAGE_SIZE, pagination }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = pagination?.currentPage || 1;
  const totalItems = pagination?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  function handlePageChange(page) {
    searchParams.set("PageNumber", page);
    searchParams.set("PageSize", pageSize);
    setSearchParams(searchParams);
  }

  function nextPage() {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  }

  function prevPage() {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  }

  // if (totalPages <= 1) return null;

  return (
    <div className="pagination-container text-center">
      <div className="pagination-text">
        Showing <span>{from}</span> to <span>{to}</span> of{" "}
        <span>{totalItems}</span> results
      </div>
      {totalPages <= 1 ? null :
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={prevPage}>
            <i className="bi bi-chevron-left"></i> Previous
          </button>
        </li>

        {getVisiblePages(currentPage, totalPages).map((page, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === page ? "active" : ""} ${
              page === "..." ? "disabled" : ""
            }`}
          >
            {page === "..." ? (
              <span className="page-link">...</span>
            ) : (
              <button
                className="page-link"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button className="page-link" onClick={nextPage}>
            Next <i className="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
      }
    </div>
  );
}

export default Pagination;
