import { axiosInterceptor } from "../axios/axiosInterceptor";

interface UserParams {
  q: string;
}

const UserApi = {
  UserGetByEmail: ({q}: UserParams) =>
    axiosInterceptor.get(`/api/users/search`, {
      params: {q},
    }),
};

export default UserApi;
