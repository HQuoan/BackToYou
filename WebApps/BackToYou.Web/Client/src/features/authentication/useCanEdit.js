// useCanEditComment.js
import { useUser } from "./useUser";

export function useCanEdit(userId) {
  const { user, isAdmin } = useUser();

  const isOwner = user?.id === userId;
  const canEdit = isAdmin || isOwner;

  return canEdit;
}