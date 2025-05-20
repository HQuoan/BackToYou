import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";

export async function getSettings() {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/post-settings`,
  });

  return data
}

export async function updateSetting(formData){
 const data = await callAPI({
    method: HttpMethod.PUT,
    url: `${ServiceRoutes.post}/post-settings`,
    data: formData,
  });

  return data
}