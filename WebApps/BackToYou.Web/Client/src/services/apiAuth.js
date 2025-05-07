import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";

export async function login(loginDto) {
  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.auth}/auth/login`,
    data: loginDto,
  });

  return data;
}

export async function loginWithGoogle(loginDto) {
  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.auth}/signin-google`,
    data: loginDto,
  });

  return data;
}

export async function loginWithFacebook(loginDto) {
  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.auth}/signin-facebook`,
    data: loginDto,
  });

  return data;
}