import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";

export async function getCategories() {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/categories`,
  });

  return data
}
