// components/CustomToast.js
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

function CustomToast({ message, t, type = "success" }) {
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    if (!paused) {
      timeoutRef.current = setTimeout(() => {
        toast.dismiss(t.id);
      }, t.duration || 3000);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        fontSize: "16px",
        maxWidth: "500px",
        padding: "16px 24px",
        backgroundColor: "var(--color-grey-0)",
        color: "var(--color-grey-700)",
        borderLeft: `5px solid ${type === "success" ? "#22c55e" : "#ef4444"}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <span>{message}</span>
      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        ✖
      </button>
    </div>
  );
}

export default CustomToast;
