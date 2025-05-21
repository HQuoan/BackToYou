import UpsertListing from "../features/posts/UpsertListing"
import "./ListingPage.css"

function ListingPage({ mode }) {


  return (
    <UpsertListing mode={mode}/>
  );
}

export default ListingPage;
