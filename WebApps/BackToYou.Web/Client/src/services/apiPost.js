import { callAPI, HttpMethod } from "./apiClient";

export async function getPosts() {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: "/posts",
    // url: "/posts?PostType=Found",
    // data: loginDto,
  });

  return data;
}

