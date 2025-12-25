import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

export const axiosInstance = axios.create({
  baseURL: "/api",          // ⭐ 핵심
  //baseURL: "http://113.198.66.75:13127",
  withCredentials: true,    // refreshToken 쿠키
});

// 요청 인터셉터 (accessToken 자동 첨부)
axiosInstance.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});