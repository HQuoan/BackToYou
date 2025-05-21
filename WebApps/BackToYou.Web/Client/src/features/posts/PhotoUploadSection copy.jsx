// import { useFormContext } from "react-hook-form";
// import { useState, useEffect, useRef } from "react";
// import ImageUploadPlaceholder from "../../ui/ImageUploadPlaceholder";

// function PhotoUploadSection() {
//   const {
//     setValue,
//     register,
//     formState: { errors },
//   } = useFormContext();

//   const [previews, setPreviews] = useState([]);
//   const inputRef = useRef();

//   const handleFilesChange = (e) => {
//     const newFiles = Array.from(e.target.files);
//     const currentFiles = previews.map((p) => p.file);

//     // Revoke old URLs to avoid memory leaks
//     previews.forEach((p) => URL.revokeObjectURL(p.url));

//     const combinedFiles = [...currentFiles, ...newFiles].slice(0, 3); // max 3
//     const updatedPreviews = combinedFiles.map((file) => ({
//       file,
//       url: URL.createObjectURL(file),
//     }));

//     setPreviews(updatedPreviews);
//     setValue("postImages", combinedFiles, { shouldValidate: true });

//     // Reset input to allow re-selection of the same file
//     if (inputRef.current) {
//       inputRef.current.value = null;
//     }
//   };

//   const removeImage = (index) => {
//     const removed = previews[index];
//     if (removed) URL.revokeObjectURL(removed.url); // Clean up URL

//     const updatedPreviews = previews.filter((_, i) => i !== index);
//     setPreviews(updatedPreviews);
//     setValue(
//       "postImages",
//       updatedPreviews.map((p) => p.file),
//       { shouldValidate: true }
//     );
//   };

//   useEffect(() => {
//     register("postImages", {
//       validate: (files) =>
//         (files && files.length > 0) || "Vui lòng tải lên ít nhất 1 ảnh",
//     });
//   }, [register]);

//   return (
//     <div id="photos" className="section mb-5 rounded card">
//       <div className="card-header d-flex align-items-center">
//         <span className="icon-circle me-2">
//           <i className="bi bi-camera"></i>
//         </span>
//         <h5 className="mb-0">Ảnh</h5>
//       </div>

//       <div className="card-body">
//         <label className="form-label fw-semibold">
//           Ảnh nhặt được (tối đa 3 ảnh)
//         </label>

//         <div
//           className="photo-upload-area border rounded d-flex flex-wrap gap-3 p-3 mb-2"
//           style={{ cursor: "pointer", minHeight: "100px" }}
//           onClick={() => inputRef.current?.click()}
//         >
//           {previews.map((img, idx) => (
//             <div key={idx} style={{ position: "relative" }}>
//               <img
//                 src={img.url}
//                 alt={`preview-${idx}`}
//                 style={{
//                   height: "120px",
//                   width: "100%",
//                   borderRadius: "6px",
//                   objectFit: "cover",
//                 }}
//               />
//               <button
//                 type="button"
//                 className="btn-remove-img"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   removeImage(idx);
//                 }}
//               >
//                 ×
//               </button>
//             </div>
//           ))}

//           {previews.length < 3 && <ImageUploadPlaceholder />}
//         </div>

//         <input
//           id="photoInput"
//           ref={inputRef}
//           type="file"
//           accept="image/*"
//           multiple
//           style={{ display: "none" }}
//           onChange={handleFilesChange}
//         />

//         {errors.postImages && (
//           <div className="text-danger">{errors.postImages.message}</div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PhotoUploadSection;
