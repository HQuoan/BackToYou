import { useEffect, useRef } from "react";

const LabelWithPopover = ({ htmlFor, label, popover }) => {
  const buttonRef = useRef();

  useEffect(() => {
    if (buttonRef.current) {
      new window.bootstrap.Popover(buttonRef.current, {
        trigger: "focus",
        placement: "bottom",
        content: popover,
      });
    }
  }, []);

  return (
    <label className="form-check-label d-flex align-items-center gap-2" htmlFor={htmlFor}>
      {label}
      <button
        ref={buttonRef}
        type="button"
        className="btn p-0 border-0 bg-transparent"
        style={{ color: "#0d6efd", lineHeight: 1 }}
        data-bs-toggle="popover"
        aria-label="Thông tin tin ưu tiên"
      >
        <i className="bi bi-question-circle-fill"></i>
      </button>
    </label>
  );
};

export default LabelWithPopover;
