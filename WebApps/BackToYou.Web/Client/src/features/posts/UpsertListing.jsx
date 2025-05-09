import { FormProvider, useForm } from "react-hook-form";
import SidebarNav from "./SidebarNav";
import ListingForm from "./ListingForm";
import useSectionObserver from "../../hooks/useSectionObserver";
import { useCreatePost } from "./useCreatePost";
import { useState } from "react";

function UpsertListing() {
  const methods = useForm();
  useSectionObserver();

  const { isCreating, createPost, error } = useCreatePost();
  const [showManual, setShowManual] = useState(false);

  const onSubmit = (data) => {
    console.log("Submitted data:", data);
    // Kiểm tra nếu có lỗi validation
    if (
      methods.formState.errors.latitude ||
      methods.formState.errors.longitude
    ) {
      setShowManual(true);
    } else {
      createPost(data);
    }
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
              <ListingForm onSubmit={methods.handleSubmit(onSubmit)} setShowManual={setShowManual} showManual={showManual} />
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpsertListing;
