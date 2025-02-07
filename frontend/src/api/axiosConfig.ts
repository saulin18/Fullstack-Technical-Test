import axios from "axios";
import Cookies from "js-cookie";
import useAuthStore from "../stores/authStore";

export const apiWithoutAuth = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (
      response.config.url?.includes("/auth/login") &&
      response.data.accessToken
    ) {
      Cookies.set("accessToken", response.data.accessToken, { secure: false });
      Cookies.set("refreshToken", response.data.refreshToken, {
        secure: false,
      });
    }

    if (response.config.url?.includes("/auth/me")) {
      useAuthStore.getState().setUser(response.data.user);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        const { data } = await apiWithoutAuth.post("/auth/refresh-token", {
          refreshToken,
        });


        Cookies.set("accessToken", data.accessToken, {
          sameSite: "lax",
          secure: false,
        });
        Cookies.set("refreshToken", data.refreshToken, {
          sameSite: "lax",
          secure: false,
        });
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Error desconocido";

    const formattedError = {
      ...error,
      message: message,
      response: {
        ...error.response,
        data: {
          ...error.response?.data,
          message: message,
        },
      },
    };

    return Promise.reject(formattedError);
  }
);
