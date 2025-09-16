// src/lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";
import { cookies } from "next/headers";
import { validateAuth } from "./validateAuth";
// axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
let accessToken: string | null = Cookies.get("accessToken") || null;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const setAccessToken = (token: string) => {
  accessToken = token;
  Cookies.set("accessToken", token);
};

api.interceptors.request.use(async (config) => {
  const cookiesStore = await cookies();
  const refreshToken = JSON.stringify(cookiesStore.get("refreshToken")?.value);
  console.log("Refresh Token from axios: ", refreshToken);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    config.headers.Cookie = `refreshToken=${refreshToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const cookiesStore = await cookies();
    const refreshToken = cookiesStore.get("refreshToken");
    console.log("Refresh Token from axios1234: ", refreshToken?.value);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post("/api/auth/refresh-token", {
          // withCredentials: true,
          // refreshToken,
        }); // 👈 no body needed
        console.log("Data in refreshing token: ", data);
        Cookies.remove("accessToken");
        console.log("Cookies removed");
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        Cookies.remove("accessToken");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);
