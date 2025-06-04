import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";

export async function getPosts({ page, filter }) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/posts`,
    params: { ...page, ...filter },
  });

  return data;
}

export async function getMyPosts({ page, filter }) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/posts/me`,
    params: { ...page, ...filter },
  });

  return data;
}

export async function getFollowedPosts({ page }) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/posts/me/following`,
    params: { ...page},
  });

  return data;
}

export async function getPostBySlug(slug) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.post}/posts/by-slug/${slug}`,
  });

  return data;
}

export async function upgradePriorityPost(postId) {
  const data = await callAPI({
    method: HttpMethod.PUT,
    url: `${ServiceRoutes.post}/posts/upgrade-priority-post/${postId}`,
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
  if (formData.streetAddress) {
    fd.append("location.streetAddress", formData.streetAddress);
  }
  fd.append("location.ward", formData.ward);
  fd.append("location.district", formData.district);
  fd.append("location.province", formData.province);

  // Contact info
  fd.append("postContact.name", formData.name);
  fd.append("postContact.phone", formData.phone);
  fd.append("postContact.email", formData.email);
  if (formData.facebook) {
    fd.append("postContact.facebook", formData.facebook);
  }

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

export async function updatePost(formData) {
  const fd = new FormData();

  fd.append("postId", formData.postId);
  fd.append("categoryId", formData.categoryId);
  fd.append("title", formData.title);
  fd.append("description", formData.description);
  fd.append("postType", formData.postType);
  fd.append("postLabel", formData.postLabel);
  fd.append("lostOrFoundDate", formData.lostOrFoundDate);

  // Location fields
  fd.append("location.latitude", formData.latitude || 0);
  fd.append("location.longitude", formData.longitude || 0);
  if (formData.streetAddress) {
    fd.append("location.streetAddress", formData.streetAddress);
  }
  fd.append("location.ward", formData.ward);
  fd.append("location.district", formData.district);
  fd.append("location.province", formData.province);

  // Contact info
  fd.append("postContact.name", formData.name);
  fd.append("postContact.phone", formData.phone);
  fd.append("postContact.email", formData.email);
  if (formData.facebook) {
    fd.append("postContact.facebook", formData.facebook);
  }

  // Images
  if (formData.postImages && Array.isArray(formData.postImages)) {
    formData.postImages.forEach((file) => {
      fd.append("imageFiles", file);
    });
  }

  const data = await callAPI({
    method: HttpMethod.PUT,
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
