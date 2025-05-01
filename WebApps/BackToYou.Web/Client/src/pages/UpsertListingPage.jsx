import { FormProvider, useForm } from "react-hook-form";
import SidebarNav from "../features/posts/SidebarNav";
import ListingForm from "../features/posts/ListingForm";
import "./UpsertListingPage.css";
import useSectionObserver from "../hooks/useSectionObserver";

function UpsertListingPage() {
  const methods = useForm();
  useSectionObserver();

  const onSubmit = (data) => {
    console.log("Submitted data:", data);
  };

  return (
    <>
      <div className="site-header"></div>
      <div className="container bg-white rounded header-content-overlay">
        <div className="row shadow rounded p-3">
          <div className="col-md-3 col-lg-2">
            <SidebarNav />
          </div>
          <div className="col-md-9 col-lg-10">
            <FormProvider {...methods}>
              <ListingForm onSubmit={methods.handleSubmit(onSubmit)} />
            </FormProvider>
          </div>
        </div>
      </div>

    </>
  );
}

export default UpsertListingPage;
