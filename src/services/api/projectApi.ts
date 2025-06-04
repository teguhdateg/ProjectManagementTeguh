import { axiosInterceptor } from "../axios/axiosInterceptor";
interface ProjectsParams{
  params: {
    page: number,
    perPage: number
  }
}


const ProjectsApi = {
  projectsGet: ({ params }: ProjectsParams) =>
    axiosInterceptor.get(
      "api/projects",
      {
        params,
        // headers: {
        //   authorisation: `${localStorage.getItem("token")}`,
        // }
    }
    ),
};

export default ProjectsApi;
