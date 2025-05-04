import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const HttpMethod = Object.freeze({
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
});


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function callAPI({ method, url, data = null, params = null }) {
  try {
    const res = await axiosInstance({
      method,
      url,
      data,
      params,
    });

    // toast.success(url)
    console.log(url)

    return res.data.result; // tương ứng với _response.Result
  } catch (err) {
    console.log(err)
    const message =
      err.response?.data?.message || err.message || "Có lỗi xảy ra";
    toast.error(message);
    throw new Error(message);
  }
}
