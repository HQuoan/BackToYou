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
});

export async function callAPI({ method, url, data = null, params = null }) {
  try {
    // console.log("%c[API REQUEST]", "color: #2196f3; font-weight: bold");
    // console.log("Method:", method.toUpperCase());
    // console.log("API_BASE_URL", API_BASE_URL);
    // console.log("URL:", url);
    // if (params) console.log("Params:", params);
    // if (data) console.log("Data:", data);

    const isFormData = data instanceof FormData;

    const res = await axiosInstance({
      method,
      url,
      data,
      params,
      headers: isFormData ? {} : { "Content-Type": "application/json" },
    });

    // console.log(
    //   "%c[API RESPONSE]",
    //   "color:rgb(33, 129, 45); font-weight: bold"
    // );
    // console.log("Data:", res.data);

    return res.data; // tương ứng với _response
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Có lỗi xảy ra";
    // toast.error(message);

    // console.log(
    //   "%c[API RESPONSE ERRORS]",
    //   "color:rgb(221, 7, 7); font-weight: bold"
    // );
    // console.log("Error:", err);
    // console.log("Data:", err.response?.data);

    if(!err.response?.data){
      toast.error(message)
    }

    // throw err.response?.data?.result || null;
    throw new Error(message)
  }
}
