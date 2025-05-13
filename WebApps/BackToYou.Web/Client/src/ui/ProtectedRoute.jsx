import { useUser } from "../features/authentication/useUser";
import { useState, useEffect } from "react";
import LoginRequiredModal from "./LoginRequiredModal";

function ProtectedRoute({ children }) {
  const { isPending, isAuthenticated } = useUser();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      setShowModal(true);
    }
  }, [isPending, isAuthenticated]);

  if (isPending) return null;

  if (!isAuthenticated) {
    return <LoginRequiredModal show={showModal} />;
  }

  return children;
}

export default ProtectedRoute;

