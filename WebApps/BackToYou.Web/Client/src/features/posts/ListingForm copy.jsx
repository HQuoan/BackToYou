// import { useEffect, useState } from "react";
// import ContactInfoSection from "./ContactInfoSection";
// import GeneralInfoSection from "./GeneralInfoSection";
// import LocationSection from "./LocationSection";
// import PhotoUploadSection from "./PhotoUploadSection";
// import { useCreatePost } from "./useCreatePost";
// import { FormProvider, useForm } from "react-hook-form";
// import { useNavigate, useParams } from "react-router-dom";
// import { usePost } from "./usePost";

// function ListingForm({ mode }) {
//   const isEdit = mode === "edit";
//   const { slug } = useParams();
//   const { isPending, post } = usePost(slug);
//   const methods = useForm();
//   const navigate = useNavigate();
//   const { isCreating, createPost } = useCreatePost();
//   const [showManual, setShowManual] = useState(false);

//   // Khi có dữ liệu post => reset form
//   useEffect(() => {
//     if (isEdit && post) {
//       methods.reset({
//         title: post.title,
//         postLabel: post.postLabel,
//         lostOrFoundDate: post.lostOrFoundDate?.split("T")[0],
//         postType: post.postType,
//         categoryId: post.categoryId,
//         description: post.description,
//         latitude: post.location.latitude,
//         longitude: post.location.longitude,
//         streetAddress: post.location.streetAddress,
//         ward: post.location.ward,
//         district: post.location.district,
//         province: post.location.province,

//         name: post.postContact.name,
//         phone: post.postContact.phone,
//         email: post.postContact.email,
//         facebook: post.postContact.facebook,


//         // Các field khác nếu cần
//       });
//     }
//   }, [isEdit, post, methods]);

//   const onSubmit = async (data) => {
//     console.log("Submitted data:", data);
//     // Kiểm tra nếu có lỗi validation
//     if (
//       methods.formState.errors.latitude ||
//       methods.formState.errors.longitude
//     ) {
//       setShowManual(true);
//     } else {
//       const post = await createPost(data);

//       if (post?.slug) {
//         navigate(`/account/history`);
//       }
//     }
//   };

//   return (
//     <FormProvider {...methods}>
//       <form
//         onSubmit={methods.handleSubmit(onSubmit)}
//         className="main-content p-4"
//       >
//         <h2 className="mb-4 text-center">Chi tiết bài đăng</h2>
//         <GeneralInfoSection />
//         <LocationSection
//           setShowManual={setShowManual}
//           showManual={showManual}
//         />
//         <PhotoUploadSection />
//         <ContactInfoSection />
//         <div className="d-flex justify-content-center mt-4">
//           {/* <button className="btn custom-btn w-100">Preview</button> */}
//           <button
//             type="submit"
//             className="btn custom-btn w-50"
//             disabled={isCreating}
//           >
//             {isCreating ? (
//               <div>
//                 <span className="spinner-border spinner-border-sm me-2"></span>
//                 Đang xử lý...
//               </div>
//             ) : (
//               "Submit"
//             )}
//           </button>
//         </div>
//       </form>
//     </FormProvider>
//   );
// }

// export default ListingForm;
