import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";

export async function getPostsWithUsers({ page, filter }) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/posts/posts-with-users`,
    params: { ...page, ...filter },
  });

  return data;
}

export async function getPostsByCategory(lastDay) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/posts/posts-by-category/${lastDay}`,
  });

  return data;
}

export async function getPosts({ page, filter }) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/posts`,
    params: { ...page, ...filter },
  });

  return data;
}

export async function getPostBySlug(slug) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/posts/by-slug-with-user/${slug}`,
  });

  return data;
}

export async function getPostById(postId) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/posts/by-id-with-user/${postId}`,
  });

  return data;
}

export async function updatePostUpdateLabelAndStatus(formData) {
  const data = await callAPI({
    method: HttpMethod.PUT,
    url: `${ServiceRoutes.post}/posts/post-label-status`,
    data: formData,
  });

  return data;
}

export async function createPost(formData) {
  const fd = new FormData();

  fd.append("categoryId", formData.categoryId);
  fd.append("title", formData.title);
  fd.append("description", formData.description);
  fd.append("postType", formData.postType);
  fd.append("postLabel", formData.postLabel);
  fd.append("lostOrFoundDate", formData.lostOrFoundDate);

  // Location fields
  fd.append("location.latitude", formData.latitude || 0);
  fd.append("location.longitude", formData.longitude || 0);
  fd.append("location.streetAddress", formData.streetAddress);
  fd.append("location.ward", formData.ward);
  fd.append("location.district", formData.district);
  fd.append("location.province", formData.province);

  // Contact info
  fd.append("postContact.name", formData.name);
  fd.append("postContact.phone", formData.phone);
  fd.append("postContact.email", formData.email);
  fd.append("postContact.facebook", formData.facebook);

  // Images
  if (formData.postImages && Array.isArray(formData.postImages)) {
    formData.postImages.forEach((file) => {
      fd.append("imageFiles", file);
    });
  }

  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.post}/posts`,
    data: fd,
  });

  return data;
}

export async function deletePost(id) {
  const data = await callAPI({
    method: HttpMethod.DELETE,
    url: `${ServiceRoutes.post}/posts/${id}`,
  });

  return data;
}
