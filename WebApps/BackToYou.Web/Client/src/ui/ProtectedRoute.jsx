import { useUser } from "../features/authentication/useUser";

function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated } = useUser();

  return children; 
}

export default ProtectedRoute;
