import { callAPI, HttpMethod } from "./apiClient";

export async function login(loginDto) {
  const data = await callAPI({
    method: HttpMethod.POST,
    url: "/auth/login",
    data: loginDto,
  });

  return data;
}

export async function loginWithGoogle(loginDto) {
  const data = await callAPI({
    method: HttpMethod.POST,
    url: "/auth/signin-google",
    data: loginDto,
  });

  return data;
}

export async function loginWithFacebook(loginDto) {
  const data = await callAPI({
    method: HttpMethod.POST,
    url: "/auth/signin-facebook",
    data: loginDto,
  });

  return data;
}