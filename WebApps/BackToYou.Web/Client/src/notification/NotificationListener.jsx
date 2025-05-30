import { useEffect } from "react";
import toast from "react-hot-toast";
import { notificationHub } from "./notificationHub";

// Tạo đối tượng audio chỉ một lần
const notificationSound = new Audio("../sounds/notification.mp3");

export const NotificationListener = () => {
    useEffect(() => {
        notificationHub
            .start()
            .then(() => {
                console.log("Connected to SignalR");

                notificationHub.on("ReceiveNotification", (data) => {
                    console.log("📩 Notification:", data);

                    // Phát âm thanh
                    notificationSound.play().catch((err) => {
                        console.warn("⚠️ Không thể phát âm thanh:", err);
                    });

                    // Hiển thị thông báo
                    toast.success(`📩 ${data.message || "Bạn có thông báo mới!"}`);
                });
            })
            .catch(console.error);

        return () => {
            notificationHub.stop();
        };
    }, []);

    return null;
};
