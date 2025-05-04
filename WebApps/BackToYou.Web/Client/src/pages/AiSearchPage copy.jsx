// import { useState, useEffect } from "react";
// import PostCard from "../ui/PostCard";
// import ImageUploadPlaceholder from "../ui/ImageUploadPlaceholder";

// function AiSearchPage() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       setSelectedImage(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file && file.type.startsWith("image/")) {
//       setSelectedImage(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleRemoveImage = () => {
//     setSelectedImage(null);
//     setPreviewUrl(null);
//   };

//   const handleSearch = async () => {
//     if (!selectedImage) return;
//     setIsLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("image", selectedImage);

//       // Simulate API call for demo purposes
//       const res = await fetch("/api/ai-search", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await res.json();
//       setPosts(result.posts || []);
//     } catch (err) {
//       console.error("Search error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Cleanup preview URL to avoid memory leaks
//   useEffect(() => {
//     return () => {
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//     };
//   }, [previewUrl]);

//   return (
//     <>
//       <div className="site-header"></div>

//       <div className="container header-content-overlay">
//         <div className="row">
//           <header className="d-flex flex-column justify-content-center align-items-center">
//             <div className="col-lg-12 col-12 text-center">
//               <h2 className="mb-3 text-white">Tìm kiếm thông minh với AI</h2>
//               <p className="text-light text-secondary-custom">
//                 Tải lên hình ảnh để khám phá các món đồ thất lạc với công nghệ AI tiên tiến
//               </p>
//             </div>
//           </header>
//         </div>

//         <div className="row min-height-600 bg-white shadow rounded p-4">
//           {/* Upload Zone */}
//           <div
//             className="col-12 mb-4 ai-upload-zone p-4 border rounded text-center "
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//           >
//             <label htmlFor="imageUpload" className="d-block cursor-pointer mb-3">
//               <strong className="text-primary-custom">
//                 Kéo & thả ảnh hoặc chọn từ thiết bị
//               </strong>
//             </label>
//             <input
//               id="imageUpload"
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="hidden"
//             />
//             {!previewUrl && (
//               <div className="d-flex justify-content-center">
//                 <label htmlFor="imageUpload">
//                   <ImageUploadPlaceholder />
//                 </label>
//               </div>
//             )}

//             {previewUrl && (
//               <div className="img-wrapper mt-3 detail-page">
//                 <div className="img-preview-container">
//                   <img
//                     src={previewUrl}
//                     alt="Preview"
//                     className="rounded shadow img-height-priority"
//                   />
//                   <button
//                     type="button"
//                     className="btn-remove-img"
//                     onClick={handleRemoveImage}
//                   >
//                     ×
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Search Button with Loading Animation */}
//           <div className="col-12 text-center mb-4">
//             <button
//               className="custom-btn px-5 py-3 badge"
//               disabled={!selectedImage || isLoading}
//               onClick={handleSearch}
//             >
//               {isLoading ? (
//                 <span className="d-flex align-items-center">
//                   <span className="spinner-border spinner-border-sm me-2"></span>
//                   Đang phân tích...
//                 </span>
//               ) : (
//                 "Tìm kiếm bằng AI"
//               )}
//             </button>
//           </div>

//           {/* Search Results */}
//           <div className="col-12">
//             <div className="row">
//               {isLoading && (
//                 <div className="text-center">
//                   <div className="spinner-border text-primary-custom" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                   </div>
//                 </div>
//               )}
//               {posts.length === 0 && !isLoading && (
//                 <div className="text-center text-secondary-custom">
//                   <em>Chưa tìm thấy kết quả phù hợp...</em>
//                 </div>
//               )}
//               {posts.map((post) => (
//                 <div key={post.id} className="col-lg-4 col-md-6 col-12 mb-4">
//                   <PostCard post={post} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Scroll to Top Button */}
//       <button className="scroll-to-top-btn">
//         <i className="bi bi-arrow-up"></i>
//       </button>
//     </>
//   );
// }

// export default AiSearchPage;