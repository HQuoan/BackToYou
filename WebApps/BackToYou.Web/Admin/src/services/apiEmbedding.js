import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";

export async function createEmbedding(postId){
  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.post}/post-images/embedding/${postId}`,
  })

  return data;
}

export async function deleteEmbedding(postId){
  const data = await callAPI({
    method: HttpMethod.DELETE,
    url: `${ServiceRoutes.post}/post-images/embedding/${postId}`,
  })

  return data;
}

