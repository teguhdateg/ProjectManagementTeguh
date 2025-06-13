
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const axiosInterceptor = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

axiosInterceptor.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInterceptor.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    if (error.response.status === 400) {
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);