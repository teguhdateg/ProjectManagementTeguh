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

interface ProjectPutPayload extends ProjectPayload {
  id: string;
}

interface ProjectDeletePayload{
  id: string;
}
interface ProjectDeleteResponse{
  message: string;
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
  
export const useProjectPut = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: ProjectsResponse, payload: ProjectPutPayload) => void;
  onError?: (error: unknown, payload: ProjectPutPayload) => void;
} = {}) =>
  useMutateApi<ProjectPutPayload, ProjectsResponse>({
    fetch: ({ id, ...body }) => ProjectsApi.projectsPut(id, body),
    key: ["ProjectsApi.projectsPut"],
    onSuccess,
    onError,
  });
export const useProjectDelete = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: ProjectDeleteResponse, payload: ProjectDeletePayload) => void;
  onError?: (error: unknown, payload: ProjectDeletePayload) => void;
} = {}) =>
  useMutateApi<ProjectDeletePayload, ProjectDeleteResponse>({
    fetch: ({ id }) => ProjectsApi.projectsDelete(id),
    key: ["ProjectsApi.projectsDelete"],
    onSuccess,
    onError,
  });
  
