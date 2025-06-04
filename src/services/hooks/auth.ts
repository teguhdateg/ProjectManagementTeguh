import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import LoginApi from "../api/loginApi";
import { useMutateApi } from "./hooks";

interface LoginPayload {
  body: {
    email: string;
    password: string;
  };
}

interface LoginResponse {
  message: string,
  user: {
    id: string,
    name: string,
    email: string
  },
  accessToken: string
  refreshToken: string
}

type UseLoginOptions = {
  onSuccess?: (data: LoginResponse, payload: LoginPayload) => void;
  onError?: (error: unknown, payload: LoginPayload) => void;
};

export const useLogin = ({ onSuccess, onError }: UseLoginOptions = {}) =>
  useMutateApi<LoginPayload, LoginResponse>({
    fetch: LoginApi.login,
    key: ["LoginApi.login"],
    onSuccess,
    onError,
  });
