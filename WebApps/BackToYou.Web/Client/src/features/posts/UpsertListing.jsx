import SidebarNav from "./SidebarNav";
import ListingForm from "./ListingForm";
import useSectionObserver from "../../hooks/useSectionObserver";

function UpsertListing({ mode }) {
  useSectionObserver();

  return (
    <>
      <div className="site-header"></div>
      <div className="container bg-white rounded header-content-overlay">
        <div className="row shadow rounded p-3">
          <div className="col-md-3 col-lg-2">
            <SidebarNav />
          </div>
          <div className="col-md-9 col-lg-10">
            <ListingForm mode={mode} />
          </div>
        </div>
      </div>
    </>
  );
}

export default UpsertListing;
