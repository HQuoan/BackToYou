// import { useState } from "react";
// import {
//   formatDateTimeVN,
//   formatDateVN,
//   formatPhoneNumber,
// } from "../utils/helpers";
// import ImageWithPopup from "./ImageWithPopup";
// import PostTypeBadge from "./PostTypeBadge ";
// import PriorityLabel from "./PriorityLabel";
// import ReportModal from "./ReportModal";
// import { useUser } from "../features/authentication/useUser";
// import toast from "react-hot-toast";
// import { POST_LABEL_FOUND, POST_LABEL_PRIORITY } from "../utils/constants";
// import { useCreateFollower } from "../features/follower/useCreateFollower";
// import { useIsFollower } from "../features/follower/useIsFollower";
// import { useDeleteFollower } from "../features/follower/useDeleteFollower";
// import { useUpdateFollower } from "../features/follower/useUpdateFollower";

// function DetailPost({ post }) {
//   const [mainImage, setMainImage] = useState(post.thumbnailUrl);
//   const [showReportModal, setShowReportModal] = useState(false);
//   const { isCreating, createFollower } = useCreateFollower();
//   const { isDeleting, deleteFollower } = useDeleteFollower();
//   const { isUpdating, updateFollower } = useUpdateFollower();
//   const { isPending, follower } = useIsFollower(post.postId);

//   console.log("follower", follower);

//   const { user, isAuthenticated } = useUser();
//   const isOwn = user?.id === post?.userId;

//   function handleReport() {
//     if (!user) toast.error("Vui lòng đăng nhập để dùng chức năng này!");
//     else setShowReportModal(true);
//   }

//   function cancelReport() {
//     setShowReportModal(false);
//   }

//   function confirmReport() {
//     setShowReportModal(false);
//   }

//   return (
//     <>
//       <div className="section-title-wrap mb-5 mt-4">
//         <h4 className="section-title text-primary-custom">
//           {post.category.name}
//         </h4>
//       </div>
//       <div className="row">
//         <div className="col-lg-3 col-12">
//           <div className="custom-block-icon-wrap">
//             <div className="custom-block-image-wrap custom-block-image-detail-page img-wrapper detail-page">
//               <ImageWithPopup src={mainImage} alt={post.title} />
//             </div>
//           </div>
//           {post.postImages && post.postImages.length > 1 && (
//             <div className="post-thumbnails mt-3 d-flex gap-2 flex-wrap">
//               {post.postImages.map((img) => (
//                 <img
//                   key={img.postImageId}
//                   src={img.imageUrl}
//                   alt="Ảnh phụ"
//                   className="img-thumbnail"
//                   style={{
//                     width: "70px",
//                     height: "70px",
//                     objectFit: "cover",
//                     cursor: "pointer",
//                     border:
//                       mainImage === img.imageUrl
//                         ? "2px solid #007bff"
//                         : "1px solid #ccc",
//                   }}
//                   onClick={() => setMainImage(img.imageUrl)}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//         <div className="col-lg-9 col-12">
//           <div className="custom-block-info">
//             <div className="min-height-300">
//               <div className="custom-block-top mb-1 d-flex flex-wrap align-items-center">
//                 <PostTypeBadge type={post.postType} />
//                 <span className="badge badge-category mb-1">
//                   <i className="bi-calendar-fill me-1"></i>
//                   {formatDateVN(post.lostOrFoundDate)}
//                 </span>
//                 <span className="badge mb-1">
//                   <i className="bi-geo-alt me-1"></i>
//                   {post.location.district}, {post.location.province}
//                 </span>
//                 {isOwn && (
//                   <span className="badge badge-author mb-1">
//                     <i className="bi-person-check me-1"></i>
//                     Bài viết của bạn
//                   </span>
//                 )}

//                 <div className="ms-auto">
//                   <PriorityLabel postLabel={post.postLabel} />
//                   {post.postLabel === POST_LABEL_FOUND && (
//                     <span className="post-label-block">Đã tìm thấy</span>
//                   )}
//                 </div>
//               </div>

//               <h2 className="mb-3 mt-3 line-clamp-detail-title">
//                 {post.title}
//               </h2>
//               <p>{post.description}</p>

//               <p>
//                 <strong>
//                   Địa chỉ {post.postType === "Lost" ? "mất: " : "nhặt: "}
//                   {post.location.streetAddress}, {post.location.ward + ", "}
//                   {post.location.district}, {post.location.province}
//                 </strong>
//               </p>

//               {isOwn && post.postLabel === POST_LABEL_PRIORITY && (
//                 <div>
//                   <p>
//                     {" "}
//                     <strong>Số ngày ưu tiên: {post.priorityDays ?? 0}</strong>
//                   </p>
//                   <p>
//                     <strong>
//                       Ngày hết ưu tiên:{" "}
//                       {post.priorityStartAt && post.priorityDays
//                         ? formatDateTimeVN(
//                             new Date(
//                               new Date(post.priorityStartAt).getTime() +
//                                 post.priorityDays * 24 * 60 * 60 * 1000
//                             )
//                           )
//                         : "Chưa xác định"}
//                     </strong>
//                   </p>
//                 </div>
//               )}
//             </div>
//             <div className="row profile-block profile-detail-block d-flex flex-wrap align-items-center mt-5">
//               <div className="col-md-6">
//                 <h5>Thông tin liên hệ</h5>
//                 <p>
//                   <strong>Tên: {post.postContact.name ?? "Unknown"}</strong>
//                   <strong>
//                     Phone:{" "}
//                     {formatPhoneNumber(post.postContact.phone ?? "Unknown")}
//                   </strong>
//                   <strong>
//                     Email:{" "}
//                     {formatPhoneNumber(post.postContact.email ?? "Unknown")}
//                   </strong>
//                 </p>
//               </div>
//               <div className="col-md-6 mb-4 d-flex flex-column align-items-end">
//                 <div className="d-flex mb-2">
//                   <button
//                     onClick={handleReport}
//                     className="btn custom-btn me-2"
//                   >
//                     Báo cáo
//                   </button>

//                   {isAuthenticated &&
//                     (follower ? (
//                       <div className="dropdown">
//                         <button
//                           className="btn custom-btn dropdown-toggle"
//                           type="button"
//                           id="followerDropdown"
//                           data-bs-toggle="dropdown"
//                           aria-expanded="false"
//                         >
//                           {follower.isSubscribed ? (
//                             <i className="bi bi-bell-fill me-3" />
//                           ) : (
//                             <i className="bi bi-bell-slash-fill me-3" />
//                           )}
//                           Đã theo dõi
//                         </button>
//                         <ul
//                           className="dropdown-menu"
//                           aria-labelledby="followerDropdown"
//                         >
//                           <li>
//                             <button
//                               className="dropdown-item"
//                               onClick={() =>
//                                 deleteFollower(follower.followerId)
//                               }
//                             >
//                               <i className="bi bi-person-x me-2" />
//                               Hủy theo dõi
//                             </button>
//                           </li>
//                           <li>
//                             <button
//                               className="dropdown-item"
//                               onClick={() =>
//                                 updateFollower({
//                                   followerId: follower.followerId,
//                                   isSubscribed: true,
//                                 })
//                               }
//                             >
//                               <i className="bi bi-bell me-2" />
//                               Tất cả
//                             </button>
//                           </li>
//                           <li>
//                             <button
//                               className="dropdown-item"
//                               onClick={() =>
//                                 updateFollower({
//                                   followerId: follower.followerId,
//                                   isSubscribed: false,
//                                 })
//                               }
//                             >
//                               <i className="bi bi-bell-slash me-2" /> Không nhận
//                               thông báo
//                             </button>
//                           </li>
//                         </ul>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => createFollower(post.postId)}
//                         className="btn custom-btn"
//                       >
//                         Theo dõi
//                       </button>
//                     ))}
//                 </div>

//                 <ul className="social-icon d-flex">
//                   {post.postContact?.facebook && (
//                     <li className="social-icon-item">
//                       <a
//                         href={post.postContact.facebook}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="social-icon-link"
//                       >
//                         <i className="bi bi-facebook"></i>
//                       </a>
//                     </li>
//                   )}
//                   <li className="social-icon-item">
//                     <a
//                       href={`https://mail.google.com/mail/u/0/?view=cm&to=${post.postContact?.email}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="social-icon-link"
//                     >
//                       <i className="bi bi-envelope"></i>
//                     </a>
//                   </li>
//                   <li className="social-icon-item">
//                     <a
//                       href={`tel:${post.postContact?.phone}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="social-icon-link"
//                     >
//                       <i className="bi bi-whatsapp"></i>
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <ReportModal
//         isOpen={showReportModal}
//         onCancel={cancelReport}
//         onConfirm={confirmReport}
//         post={post}
//         isOwn={isOwn}
//       />
//     </>
//   );
// }

// export default DetailPost;
