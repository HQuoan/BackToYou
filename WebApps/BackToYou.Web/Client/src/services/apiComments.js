import { callAPI, HttpMethod } from "./apiClient";

export async function createComment(comment){
  const data = await callAPI({
    method: HttpMethod.POST,
    url: "/comments",
    data: comment
  })

  return data;
}

export async function deleteComment(id){
  const data = await callAPI({
    method: HttpMethod.POST,
    url: "/comments",
    data: id
  })

  return data;
}
