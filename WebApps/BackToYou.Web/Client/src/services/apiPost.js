import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";

export async function getPosts({page, filter}) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/posts`,
    params: {...page, ...filter}
  });

  return data
}
