import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";

export async function getProvinces(name) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/locations/provinces`,
    params: {name}
  });

  return data  //{ p.Code, p.Name }
}

export async function getDistricts(provinceCode, name) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/locations/districts`,
    params: {provinceCode, name}
  });

  return data  //{ p.Code, p.Name }
}

export async function getWards(districtCode, name) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/locations/wards`,
    params: {districtCode,name}
  });

  return data  //{ p.Code, p.Name }
}