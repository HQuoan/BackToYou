import { callAPI, HttpMethod } from "./apiClient";

export async function aiSearch(formData) {
  const data = await callAPI({
    method: HttpMethod.POST,
    url: "/post-images/ai-search",
    data: formData
  });

  return data
}
