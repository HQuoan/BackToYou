// import { useUser } from "../features/authentication/useUser";

// function ProtectedRoute({ children }) {
//   const { isLoading, isAuthenticated } = useUser();

//   return children; 
// }

// export default ProtectedRoute;

// ui/ProtectedRoute.jsx
import { useUser } from "../features/authentication/useUser";
import { useState, useEffect } from "react";
import LoginRequiredModal from "./LoginRequiredModal";

function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated } = useUser();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowModal(true);
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <LoginRequiredModal show={showModal} />;
  }

  return children;
}

export default ProtectedRoute;

