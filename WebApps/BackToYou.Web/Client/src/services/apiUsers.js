import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";



export async function getMe() {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.auth}/users/GetById`,
  });

  return data
}
