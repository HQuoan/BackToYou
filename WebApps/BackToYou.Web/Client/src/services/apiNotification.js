import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";

export async function getMyNotifications({ page, filter }) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.notification}/notifications/me`,
    params: { ...page, ...filter },
  });

  return data;
}

export async function markAsRead(id) {
  const data = await callAPI({
    method: HttpMethod.PUT,
    url: `${ServiceRoutes.notification}/notifications/mark-as-read/${id}`,
  });

  return data;
}