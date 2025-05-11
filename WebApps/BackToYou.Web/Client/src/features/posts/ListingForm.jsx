import { useState } from "react";
import ContactInfoSection from "./ContactInfoSection";
import GeneralInfoSection from "./GeneralInfoSection";
import LocationSection from "./LocationSection";
import PhotoUploadSection from "./PhotoUploadSection";
import { useCreatePost } from "./useCreatePost";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function ListingForm() {
  const methods = useForm();
  const navigate = useNavigate();

  const { isCreating, createPost, error } = useCreatePost();
  const [showManual, setShowManual] = useState(false);

  const onSubmit = async (data) => {
    console.log("Submitted data:", data);
    // Kiểm tra nếu có lỗi validation
    if (
      methods.formState.errors.latitude ||
      methods.formState.errors.longitude
    ) {
      setShowManual(true);
    } else {
      const post = await createPost(data);

      if (post?.slug) {
        navigate(`/${post.slug}`);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="main-content p-4"
      >
        <h2 className="mb-4 text-center">Chi tiết bài đăng</h2>
        <GeneralInfoSection />
        <LocationSection
          setShowManual={setShowManual}
          showManual={showManual}
        />
        <PhotoUploadSection />
        <ContactInfoSection />
        <div className="d-flex justify-content-center mt-4">
          {/* <button className="btn custom-btn w-100">Preview</button> */}
          <button
            type="submit"
            className="btn custom-btn w-50"
            disabled={isCreating}
          >
            {isCreating ? (
              <div>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang xử lý...
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default ListingForm;
