import { callAPI, HttpMethod } from "./apiClient";

export async function getPosts({page, filter}) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: "/posts",
    params: {...page, ...filter}
  });

  return data
}
