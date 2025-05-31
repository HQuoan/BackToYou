import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";


export async function getComments({page, postId}) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/comments`,
    params: {...page, postId, isParentCommentNull:true,includeProperties:"ChildComments" }
  });

  return data
}

export async function getCommentById(id) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/comments/${id}`,
  });

  return data;
}


export async function createComment(comment){
  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.post}/comments`,
    data: comment
  })

  return data;
}

export async function deleteComment(id){
  const data = await callAPI({
    method: HttpMethod.DELETE,
    url: `${ServiceRoutes.post}/comments/${id}`,
  })

  return data;
}
