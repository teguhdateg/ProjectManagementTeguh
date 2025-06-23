import { axiosInterceptor } from "../axios/axiosInterceptor";

interface ProjectsParams {
  name: string;
  page: number;
  perPage: number;
}

interface ProjectPayload {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  status: string;
  documents: Array<{
    name: string;
    url: string;
  }>;
  teamEmails: string[];
}

const ProjectsApi = {
  projectsGet: ({name, page, perPage }: ProjectsParams) =>
    axiosInterceptor.get("api/projects", {
      params: {name, page, perPage },
    }),

  projectById: (id: string) =>
    axiosInterceptor.get(`api/projects/${id}`),

  projectPost: (body: ProjectPayload) =>
    axiosInterceptor.post("api/projects", body),

  projectsPut: (id:string, body: ProjectPayload ) =>
    axiosInterceptor.put(`api/projects/${id}`, body),
  
  projectsDelete: (id:string ) =>
    axiosInterceptor.delete(`api/projects/${id}`),
};

export default ProjectsApi;
