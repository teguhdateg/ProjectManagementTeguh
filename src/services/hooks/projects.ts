import { useGetApiWithParams, useMutateApi } from "./hooks";
import ProjectsApi from "../api/projectApi";

// Type untuk satu project (bisa digunakan untuk iterasi list)
export type Project = ProjectsResponse['data'][number];

// Alias tipe response
export type ProjectResponse = ProjectsResponse;

// Parameter untuk GET
interface ProjectsParams {
  name:string;
  page: number;
  perPage: number;
}

// Response struktur dari backend
interface ProjectsResponse {
  data: Array<{
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    status: string;
    documents: Array<{
      url: string;
      name: string;
    }>;
    createdAt: string;
    updatedAt: string;
    createdById: string;
    userId: string;
    teams: Array<{
      id: string;
      name: string;
      email: string;
    }>;
    createdBy: {
      id: string;
      name: string;
      email: string;
    };
    isOverdue: boolean;
    overdueDays: number;
  }>;
  meta: {
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  };
}

// Payload POST project
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

// Options untuk GET
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

export const useProjectsGetById = ({
  id,
  onSuccess,
  onError,
}: {
  id: string;
  onSuccess?: (data: ProjectsResponse) => void;
  onError?: (error: unknown) => void;
}) =>
  useGetApiWithParams<string, ProjectsResponse>({
    fetch: ProjectsApi.projectById,
    key: ["ProjectsApi.projectById", id],
    payload: id,
    onSuccess,
    onError,
  });

export const useProjectPost = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: ProjectsResponse, payload: ProjectPayload) => void;
  onError?: (error: unknown, payload: ProjectPayload) => void;
} = {}) =>
  useMutateApi<ProjectPayload, ProjectsResponse>({
    fetch: ProjectsApi.projectPost,
    key: ["ProjectsApi.projectPost"],
    onSuccess,
    onError,
  });
