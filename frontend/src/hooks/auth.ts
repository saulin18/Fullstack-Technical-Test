import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  loginUser,
  logoutApi,
  registerUser,
} from "../api/auth";
import useAuthStore from "../stores/authStore";
import { toast } from "sonner";

export const useAuth = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: Infinity,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      loginUser(credentials.username, credentials.password),
    onSuccess: (data) => {
      login(data.user);
      queryClient.setQueryData(["user"], data.user);

      window.location.href = "/";
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast.error(error.response.data.message);
    },
    throwOnError: false,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      registerUser(credentials.username, credentials.password),
    onSuccess: (data) => {
      console.log(data);
      window.location.href = "/";
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      toast.error(error.response.data.message);
    },
    throwOnError: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
};
