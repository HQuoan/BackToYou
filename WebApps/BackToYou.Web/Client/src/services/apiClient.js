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
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

export async function callAPI({ method, url, data = null, params = null }) {
  try {
    console.log("%c[API REQUEST]", "color: #2196f3; font-weight: bold");
    console.log("Method:", method.toUpperCase());
    console.log("URL:", url);
    console.log("API_BASE_URL",API_BASE_URL)
    if (params) console.log("Params:", params);
    if (data) console.log("Data:", data);


    const isFormData = data instanceof FormData;

    const res = await axiosInstance({
      method,
      url,
      data,
      params,
      headers: isFormData ? {} : { "Content-Type": "application/json" },
    });
    

    // const res = await axiosInstance({
    //   method,
    //   url,
    //   data,
    //   params,
    // });

    console.log("%c[API RESPONSE]", "color:rgb(33, 129, 45); font-weight: bold");
    console.log("Data:", res.data)

    // toast.success(url)

    return res.data; // tương ứng với _response
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Có lỗi xảy ra";
    toast.error(message);
    throw new Error(message);
  }
}
