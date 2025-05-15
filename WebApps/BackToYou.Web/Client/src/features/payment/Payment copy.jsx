// import { useForm } from "react-hook-form";
// import { useCreateReceipt } from "./useCreateReceipt";
// import { useReceipts } from "./useReceipts";
// import { useBalance } from "./useBalance";
// import { useCreateSession } from "./useCreateSession";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { useValidateSession } from "./useValidateSession";
// import { useEffect, useRef, useState } from "react";
// import { useDeleteReceipt } from "./useDeleteReceipt";
// import Spinner from "./../../ui/Spinner";
// import Pagination from "../../ui/Pagination";

// const Payment = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [statusFilter, setStatusFilter] = useState(undefined);
//   const filterNavRef = useRef(null);

//   const pageNumber = Number(searchParams.get("PageNumber")) || 1;

//   useEffect(() => {
//     if (pageNumber !== 1) {
//       if (filterNavRef.current) {
//         filterNavRef.current.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//       }
//     }
//   }, [pageNumber]);

//   const { isPending, receipts, pagination } = useReceipts({
//     status: statusFilter,
//   });

//   const { isPending: isLoadingBalance, balance } = useBalance();
//   const { isCreating, createReceipt } = useCreateReceipt();
//   const { isCreating: isCreatingSession, createSession } = useCreateSession();

//   const receptIdValidate = searchParams.get("receiptId") || undefined;

//   const { validateSession } = useValidateSession();

//   useEffect(() => {
//     if (receptIdValidate) {
//       validateSession(receptIdValidate).finally(() => {
//         searchParams.delete("receiptId");
//         navigate({
//           pathname: "/account/payment",
//           search: searchParams.toString(),
//         });
//       });
//     }
//   }, [receptIdValidate, validateSession, searchParams, navigate]);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     createReceipt(data, {
//       onSuccess: (receipt) => {
//         console.log("session", receipt);
//         if (data.paymentMethod === "STRIPE" || data.paymentMethod === "PAYOS") {
//           const url = `http://localhost:5000/account/payment?receiptId=${receipt.receiptId}`;
//           createSession(
//             {
//               receiptId: receipt.receiptId,
//               approvedUrl: url,
//               cancelUrl: url,
//             },
//             {
//               onError: (err) => {
//                 console.error("Tạo session thất bại:", err.message);
//               },
//             }
//           );
//         }
//       },
//     });
//   };

//   function handleCreateSession(receiptId) {
//     const url = `http://localhost:5000/account/payment?receiptId=${receiptId}`;
//     createSession({ receiptId, approvedUrl: url, cancelUrl: url });
//   }

//   const { isDeleting, deleteReceipt } = useDeleteReceipt();
//   function handleDeleteReceipt(receiptId) {
//     deleteReceipt(receiptId);
//   }

//   return (
//     <div className="payment-page">
//       <div className="text-center p-3">
//         <h2>Ví & Thanh toán</h2>
//       </div>

//       {/* Wallet Section */}
//       <div className="wallet-section custom-block">
//         <h3 className="text-black-custom">Ví của bạn</h3>
//         {isLoadingBalance ? (
//           <Spinner />
//         ) : (
//           <div className="wallet-balance">
//             <span className="balance-amount">{balance.toLocaleString()}</span>
//             <span className="balance-currency">Xu</span>
//           </div>
//         )}

//         {/* Top-up Form */}
//         <form className="top-up-form" onSubmit={handleSubmit(onSubmit)}>
//           <div className="form-floating mb-3">
//             <input
//               type="number"
//               className={`form-control ${errors.amount ? "is-invalid" : ""}`}
//               id="amount"
//               placeholder="Nhập số lượng"
//               {...register("amount", {
//                 required: "Vui lòng nhập số xu",
//                 min: {
//                   value: 10000,
//                   message: "Số lượng tối thiểu là 10,000",
//                 },
//                 validate: (value) => value >= 0 || "Số lượng không được âm",
//               })}
//             />
//             <label htmlFor="amount">Nhập số lượng (Xu)</label>
//             {errors.amount && (
//               <div className="invalid-feedback">{errors.amount.message}</div>
//             )}
//           </div>

//           <div ref={filterNavRef} className="form-floating mb-3">
//             <select
//               className="form-control"
//               {...register("paymentMethod", { required: true })}
//               id="paymentMethod"
//             >
//               <option value="STRIPE">Stripe</option>
//               <option value="PAYOS">PayOS</option>
//             </select>
//             <label htmlFor="paymentMethod">Phương thức thanh toán</label>
//           </div>

//           <button type="submit" className="custom-btn" disabled={isCreating}>
//             {isCreating || isCreatingSession ? "Đang xử lý..." : "Nạp ngay"}
//           </button>
//         </form>
//       </div>

//       {/* Receipts Section */}
//       <div className="receipts-section custom-block">
//         <h3 className="text-black-custom">Lịch sử giao dịch</h3>
//         <div className="receipts-filter-nav account-nav">
//           {["All", "Pending", "Session_Created", "Completed"].map((status) => (
//             <button
//               key={status}
//               onClick={() => {
//                 setStatusFilter(status === "All" ? undefined : status)

//                 const newParams = new URLSearchParams(searchParams.toString());
//                 newParams.delete("PageNumber");
//                 newParams.delete("PageSize");
                
//                 setSearchParams(newParams);
//               }}
//               className={`nav-link ${
//                 statusFilter === status || (status === "All" && !statusFilter)
//                   ? "active"
//                   : ""
//               }`}
//             >
//               {status}
//             </button>
//           ))}
//         </div>

//         {receipts.length === 0 ? (
//           <p className="text-grey-custom">Hiện không có giao dịch nào.</p>
//         ) : isPending ? (
//           <Spinner />
//         ) : (
//           <>
//             <div className="receipts-list">
//               {receipts.map((receipt) => (
//                 <div key={receipt.receiptId} className="receipt-item row">
//                   <div className="col-4">
//                     {" "}
//                     <div className="receipt-info">
//                       <span className="receipt-amount">
//                         {receipt.amount.toLocaleString()} Xu
//                       </span>
//                       <span
//                         className={`receipt-status status-${receipt.status.toLowerCase()}`}
//                       >
//                         {receipt.status}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="col-8">
//                     <div className="receipt-details">
//                       <p className="text-grey-custom">
//                         Ngày: {new Date(receipt.createdAt).toLocaleString()}
//                       </p>
//                       <p className="text-grey-custom">
//                         Phương thức: {receipt.paymentMethod}
//                       </p>
//                       <p className="text-grey-custom">
//                         ID giao dịch: {receipt.receiptId}
//                       </p>
//                       {receipt.status === "Pending" &&
//                         !receipt.paymentSessionUrl && (
//                           <button
//                             onClick={() =>
//                               handleCreateSession(receipt.receiptId)
//                             }
//                             className="custom-btn"
//                           >
//                             {isCreatingSession
//                               ? "Đang tạo phiên..."
//                               : "Tạo lại phiên thanh toán"}
//                           </button>
//                         )}
//                       {receipt.status === "Session_Created" &&
//                         receipt.paymentSessionUrl && (
//                           <button className="custom-btn">
//                             <Link
//                               to={receipt.paymentSessionUrl}
//                               className="text-white"
//                             >
//                               Thanh toán
//                             </Link>
//                           </button>
//                         )}

//                       {receipt.status !== "Completed" && (
//                         <button
//                           className="custom-btn cancel-btn ms-3"
//                           onClick={() => handleDeleteReceipt(receipt.receiptId)}
//                           disabled={isDeleting}
//                         >
//                           {isDeleting ? "Đang xử lý..." : "Hủy"}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="row">
//               <Pagination pagination={pagination} pageSize={5} />
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Payment;
