// import { useEffect } from "react";
// import {useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { notificationHub } from "./notificationHub";

// // Tạo đối tượng audio chỉ một lần
// const notificationSound = new Audio("../sounds/notification.mp3");

// export const NotificationListener = () => {
//  const queryClient = useQueryClient();

//     useEffect(() => {
//         notificationHub
//             .start()
//             .then(() => {
//                 console.log("Connected to SignalR");

//                 notificationHub.on("ReceiveNotification", (data) => {
//                     console.log("📩 Notification:", data);

//                     // Phát âm thanh
//                     notificationSound.play().catch((err) => {
//                         console.warn("⚠️ Không thể phát âm thanh:", err);
//                     });

//                     // Hiển thị thông báo
//                     toast.success(`📩 ${data.message || "Bạn có thông báo mới!"}`);

//                     queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
//                 });
//             })
//             .catch(console.error);

//         return () => {
//             notificationHub.stop();
//         };
//     }, []);

//     return null;
// };

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { notificationHub } from "./notificationHub";

// Tạo đối tượng audio chỉ một lần
const notificationSound = new Audio("../sounds/notification.mp3");

export const NotificationListener = () => {
  const queryClient = useQueryClient();
  const isListenerRegistered = useRef(false); // để kiểm tra đã đăng ký chưa

  useEffect(() => {
    let isMounted = true;

    notificationHub
      .start()
      .then(() => {
        console.log("✅ Connected to SignalR");

        if (!isListenerRegistered.current && isMounted) {
          notificationHub.on("ReceiveNotification", (data) => {
            console.log("📩 Notification:", data);

            // Phát âm thanh
            notificationSound.play().catch((err) => {
              console.warn("⚠️ Không thể phát âm thanh:", err);
            });

            // Hiển thị toast
            toast.success(`📩 ${data.message || "Bạn có thông báo mới!"}`);

            // Cập nhật dữ liệu
            queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
            queryClient.invalidateQueries({ queryKey: ["comments"] });
          });

          isListenerRegistered.current = true;
        }
      })
      .catch((err) => {
        console.error("❌ SignalR connection error:", err);
      });

    return () => {
      isMounted = false;
      notificationHub.stop();
      // Không xóa listener ở đây vì SignalR có thể tái sử dụng kết nối cũ
    };
  }, [queryClient]);

  return null;
};

