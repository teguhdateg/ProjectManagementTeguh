
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const axiosInterceptor = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

axiosInterceptor.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      console.log(token,"token")
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
      console.log(localStorage.getItem("token"));
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);