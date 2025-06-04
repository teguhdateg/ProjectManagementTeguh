import { axiosInterceptor } from "../axios/axiosInterceptor";

interface Login {
  body: {
    email: string;
    password: string;
  };
}

const LoginApi = {
  login: ({ body }: Login) =>
    axiosInterceptor.post(
      "/api/auth/login",
      body,
      {}
    ),
};

export default LoginApi;
