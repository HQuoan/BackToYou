import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";

export async function createReport(report){
  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.post}/reports`,
    data: report
  })

  return data;
}