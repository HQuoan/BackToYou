import { getInitials } from "../utils/helpers";

function PlaceholderAvatar({name}) {
  return (
    <div
      className="d-flex justify-content-center align-items-center bg-secondary rounded-circle"
      style={{ width: 50, height: 50, fontSize: 16, color: "#fff" }}
    >
      {getInitials(name)}
    </div>
  );
}

export default PlaceholderAvatar;
