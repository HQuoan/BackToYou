import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";


export async function getCurrentUser() {
  const res = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.auth}/users/GetById`,
  });

  return res?.result;
}
