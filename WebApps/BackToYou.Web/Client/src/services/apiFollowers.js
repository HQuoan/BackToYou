import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";

export async function isFollower(postId) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/followers/is-follower/${postId}`,
  });

  return data;
}

export async function createFollower(postId){
  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.post}/followers`,
    data: {postId}
  })

  return data;
}

export async function updateFollower({ followerId, isSubscribed }) {
  return callAPI({
    method: HttpMethod.PUT,
    url: `${ServiceRoutes.post}/followers`,
    data: { followerId, isSubscribed },
  });
}


export async function deleteFollower(id){
  const data = await callAPI({
    method: HttpMethod.DELETE,
    url: `${ServiceRoutes.post}/followers/${id}`,
  })

  return data;
}

