import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";
import { PostLabel_Priority_Price, Priority_Days } from './../utils/constants';

export async function getPostPriorityPrice() {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/post-settings/by-name/${PostLabel_Priority_Price}`,
  });

  return data
}


export async function getPostSettings() {
const names = [PostLabel_Priority_Price, Priority_Days]

  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.post}/post-settings/by-names`,
    data: names
  });

  return data
}