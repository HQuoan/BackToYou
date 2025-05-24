import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";


export async function getReports({page, filter}) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/reports`,
    params: {...page, ...filter}
  });

  return data
}

export async function getReport(reportId) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/reports/${reportId}`,
  });

  return data
}

export async function updateReportStatus(formData) {
  const data = await callAPI({
    method: HttpMethod.PUT,
    url: `${ServiceRoutes.post}/reports`,
    data: formData,
  });

  return data
}


export async function deleteReport(reportId) {
  const data = await callAPI({
    method: HttpMethod.DELETE,
    url: `${ServiceRoutes.post}/reports/${reportId}`,
  });

  return data
}