import { User } from "../types/types";
import { api, apiWithoutAuth } from "./axiosConfig";

export const loginUser = async (username: string, password: string) => {
  const { data } = await api.post(
    "/auth/login",
    { username, password }
  );
  return data;
};

export const registerUser = async (username: string, password: string) => {
  const { data } = await apiWithoutAuth.post(
    "/auth/register",
    { username, password }
  );
  return data;
};

export const refreshToken = async (refreshToken: string) => {
  const { data } = await api.post(
    `/auth/refresh`,
    { refreshToken }
  );
  return data;
};

export const logoutApi = async () => {
  await api.post(`/auth/logout`);
};


export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<{ user: User }>("/auth/me");
    return data.user;
  } catch (error) {
    return null;
  }
};
