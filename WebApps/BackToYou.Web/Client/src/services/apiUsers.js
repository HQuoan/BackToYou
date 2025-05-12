import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";


export async function getCurrentUser() {
  const res = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.auth}/users/get-by-id`,
  });

  return res?.result;
}

export async function updateInfo(info) {
  const res = await callAPI({
    method: HttpMethod.PUT,
    url: `${ServiceRoutes.auth}/users/update-info`,
    data: info
  });

  return res?.result;
}

export async function uploadAvatar(avatar) {
  const fd = new FormData();

  fd.append("avatar",avatar )


  const res = await callAPI({
    method: HttpMethod.PUT,
    url: `${ServiceRoutes.auth}/users/upload-avatar`,
    data: fd
  });

  return res?.result;
}
