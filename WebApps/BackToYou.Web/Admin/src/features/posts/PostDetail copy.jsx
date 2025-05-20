// import styled from "styled-components";
// import { useParams } from "react-router-dom";

// import PostDataBox from "./PostDataBox";
// import Row from "../../ui/Row";
// import Heading from "../../ui/Heading";
// import Tag from "../../ui/Tag";
// import ButtonGroup from "../../ui/ButtonGroup";
// import Button from "../../ui/Button";
// import ButtonText from "../../ui/ButtonText";
// import Spinner from "../../ui/Spinner";
// import Modal from "../../ui/Modal";
// import Empty from "../../ui/Empty";
// import { useMoveBack } from "../../hooks/useMoveBack";
// import { usePost } from "./usePost";
// import {
//   POST_STATUS_APPROVED,
//   POST_STATUS_PROCESSING,
//   POST_STATUS_REJECTED,
// } from "./../../utils/constants";
// import { useUpdatePostUpdateLabelAndStatus } from "./useUpdatePostUpdateLabelAndStatus";
// import ConfirmReject from "../../ui/ConfirmReject";
// import { useCreateEmbedding } from "./../embeddings/useCreateEmbedding";
// import { useDeleteEmbedding } from "./../embeddings/useDeleteEmbedding";
// import { useForm } from "react-hook-form";
// import FormRow from "../../ui/FormRow";
// import Textarea from "../../ui/Textarea";
// import FormRowVertical from "../../ui/FormRowVertical";
// import Form from "../../ui/Form";

// const HeadingGroup = styled.div`
//   display: flex;
//   gap: 2.4rem;
//   align-items: center;
// `;

// function PostDetail() {
//   const moveBack = useMoveBack();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const { isLoading: isCreateEmbedding, createEmbedding } =
//     useCreateEmbedding();
//   const { isLoading: isDeleteEmbedding, deleteEmbedding } =
//     useDeleteEmbedding();

//   const { slug } = useParams();
//   const { post, isLoading } = usePost(slug);

//   const { isLoading: isUpdating, updatePostUpdateLabelAndStatus } =
//     useUpdatePostUpdateLabelAndStatus();

//   const isActionLoading = isUpdating || isCreateEmbedding || isDeleteEmbedding;

//   if (isLoading) return <Spinner />;
//   if (!post) return <Empty resourceName="post" />;

//   const { postStatus, postId, isEmbedded } = post;

//   function handleChangePostStatus(status) {
//     updatePostUpdateLabelAndStatus({ postId: postId, postStatus: status });
//   }

//   const onReject = ({ reason }) => {
//     updatePostUpdateLabelAndStatus({
//       postId,
//       postStatus: POST_STATUS_REJECTED,
//       rejectionReason: reason,
//     });
//     reset();
//   };

//   const statusToTagName = {
//     Pending: "blue",
//     Approved: "green",
//     Rejected: "silver",
//   };

//   return (
//     <>
//       <Row type="horizontal">
//         <HeadingGroup>
//           <Heading as="h1">Post #{postId}</Heading>
//           <Tag type={statusToTagName[postStatus]}>{postStatus}</Tag>
//         </HeadingGroup>
//         <ButtonText onClick={moveBack}>← Back</ButtonText>
//       </Row>

//       <PostDataBox post={post} />

//       <ButtonGroup>
//         {postStatus === POST_STATUS_APPROVED && !isEmbedded && (
//           <Button
//             onClick={() => createEmbedding(postId)}
//             disabled={isActionLoading}
//           >
//             {isCreateEmbedding ? "Đang xử lý..." : "Trích xuất"}
//           </Button>
//         )}

//         {postStatus === POST_STATUS_REJECTED && isEmbedded && (
//           <Button
//             onClick={() => deleteEmbedding(postId)}
//             disabled={isActionLoading}
//           >
//             {isDeleteEmbedding ? "Đang xử lý..." : "Xóa đặc trưng"}
//           </Button>
//         )}

//         {postStatus !== POST_STATUS_PROCESSING && (
//           <Button
//             onClick={() => handleChangePostStatus(POST_STATUS_PROCESSING)}
//             disabled={isActionLoading}
//           >
//             Process
//           </Button>
//         )}

//         {postStatus === POST_STATUS_PROCESSING && (
//           <>
//             <Button
//               variation="success"
//               onClick={() => handleChangePostStatus(POST_STATUS_APPROVED)}
//               disabled={isActionLoading}
//             >
//               Approve
//             </Button>

//             <Modal>
//               <Modal.Open opens="reject">
//                 <Button variation="danger" disabled={isActionLoading}>
//                   Reject
//                 </Button>
//               </Modal.Open>

//               <Modal.Window name="reject">
//                 {/* <ConfirmReject
//                   resourceName="post"
//                   disabled={isActionLoading}
//                   onConfirm={() => handleChangePostStatus(POST_STATUS_REJECTED)}
//                 /> */}
//                 <Form onSubmit={handleSubmit(onReject)}>
//                   <FormRowVertical
//                     label="Rejection reason"
//                     error={errors.reason?.message}
//                   >
//                     <Textarea
//                       style={{ width: "500px", height: "200px" }}
//                       rows={4}
//                       placeholder="Hãy cho tác giả biết lý do từ chối…"
//                       {...register("reason", {
//                         required: "Vui lòng nhập lý do",
//                         minLength: {
//                           value: 10,
//                           message: "Lý do tối thiểu 10 ký tự",
//                         },
//                       })}
//                     />
//                   </FormRowVertical>

//                   <FormRow>
//                     <Button
//                       variation="danger"
//                       disabled={isActionLoading}
//                       type="submit"
//                     >
//                       {isActionLoading ? "Đang xử lý…" : "Xác nhận Reject"}
//                     </Button>
//                   </FormRow>
//                 </Form>
//               </Modal.Window>
//             </Modal>
//           </>
//         )}

//         <Button
//           variation="secondary"
//           onClick={moveBack}
//           disabled={isActionLoading}
//         >
//           Back
//         </Button>
//       </ButtonGroup>
//     </>
//   );
// }

// export default PostDetail;
