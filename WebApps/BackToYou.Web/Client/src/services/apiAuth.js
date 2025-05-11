import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";

export async function login(loginDto) {
  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.auth}/auth/login`,
    data: loginDto,
  });

  return data?.result?.user;
}

export async function loginWithGoogle(loginDto) {
  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.auth}/auth/signin-google`,
    data: loginDto,
  });

  return data?.result?.user;
}

export async function loginWithFacebook(loginDto) {
  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.auth}/auth/signin-facebook`,
    data: loginDto,
  });

  return data?.result?.user;
}

export async function logout() {
  await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.auth}/auth/logout`,
  });
}
