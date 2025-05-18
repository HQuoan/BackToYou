import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiUsers";

export function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(),
    retry: false,
  });

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role?.includes("ADMIN") ?? false; /// "role": "ADMIN, CUSTOMER",

  return { user, isLoading, isAuthenticated, isAdmin };
}
