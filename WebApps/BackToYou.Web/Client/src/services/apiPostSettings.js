import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";
import { PostLabel_Priority_Price } from './../utils/constants';

export async function getPostPriorityPrice() {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/post-settings/by-name/${PostLabel_Priority_Price}`,
  });

  return data
}