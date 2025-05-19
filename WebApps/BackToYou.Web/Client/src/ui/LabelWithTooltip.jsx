const LabelWithTooltip = ({ htmlFor, label, tooltip }) => {
  return (
    <label className="form-check-label d-flex align-items-center gap-2" htmlFor={htmlFor}>
      {label}
      <i
        className="bi bi-question-circle-fill"
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title={tooltip}
        style={{ cursor: "pointer", color: "#0d6efd" }}
      ></i>
    </label>
  );
};

export default LabelWithTooltip;
