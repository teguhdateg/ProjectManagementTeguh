
import { useGetApiWithParams } from "./hooks";
import ProjectsApi from "../api/projectApi";

interface ProjectsParams {
  params: {
    page: number,
    perPage: number
  };
}

interface ProjectsResponse {
  data:[
    {
      id: string,
      name: string,
      startDate: string,
      endDate: string,
      description: string,
      status: string,
      documents: [
        {
          url: string,
          name: string
        }
      ],
      createdAt: string,
      updatedAt: string,
      createdById: string,
      userId: string,
      teams: [
        {
          id: string,
          name: string,
          email: string
        },
      ],
      createdBy: {
        id: string,
        name: string,
        email: string
      },
      isOverdue: boolean,
      overdueDays: number
    },
  ] ;
}

type UseProjectsOptions = {
  params: ProjectsParams;
  onSuccess?: (data: ProjectsResponse, params: ProjectsParams) => void;
  onError?: (error: unknown, params: ProjectsParams) => void;
};

export const useProjectsGet = ({ params, onSuccess, onError }: UseProjectsOptions) =>
  useGetApiWithParams<ProjectsParams, ProjectsResponse>({
    fetch: ProjectsApi.projectsGet,
    key: ["ProjectsApi.projectsGet"],
    payload: params,
    onSuccess,
    onError,
  });

