import { useGetApiWithParams, useMutateApi } from "./hooks";
import TaskApi from "../api/taskApi";

// Parameter untuk GET
interface TaskParams {
  projectId:string;
  status: string;
  priority: string;
  page: number;
  perPage: number;
}

interface TaskResponse {
  data: Array<{
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    priority: string;
    projectId: string;
    assigneeId: string;
    createdById: string;
    createdAt: string;
    updatedAt: string;
    assignee: {
      id: string;
      name: string;
      email: string;
    };
    project: {
      id: string;
      name: string;
    };
    createdBy: {
      id: string;
      name: string;
      email: string;
    };
    isOverdue: boolean;
    overdueDays: number | null;
  }>;
}

interface TaskPayload {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
  assigneeId: string;
}

// Options untuk GET
type UseTaskOptions = {
  params: TaskParams;
  onSuccess?: (data: TaskResponse, params: TaskParams) => void;
  onError?: (error: unknown, params: TaskParams) => void;
};

export const useTaskGet = ({ params, onSuccess, onError }: UseTaskOptions) =>
  useGetApiWithParams<TaskParams, TaskResponse>({
    fetch: TaskApi.TaskGet,
    key: ["TaskApi.TaskGet"],
    payload: params,
    onSuccess,
    onError,
  });

export const useTaskPost = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: TaskResponse, payload: TaskPayload & { projectId: string }) => void;
  onError?: (error: unknown, payload: TaskPayload & { projectId: string }) => void;
} = {}) =>
  useMutateApi<TaskPayload & { projectId: string }, TaskResponse>({
    fetch: (payload) => {
      const { projectId, ...body } = payload;
      return TaskApi.TaskPost(projectId, body);
    },
    key: ["TaskApi.TaskPost"],
    onSuccess,
    onError,
  });

