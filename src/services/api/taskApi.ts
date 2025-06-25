import { axiosInterceptor } from "../axios/axiosInterceptor";

interface TaskParams {
  projectId: string;
  status: string;
  priority: string;
  page: number;
  perPage: number;
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

const TaskApi = {
  TaskGet: ({ projectId, status, priority, page, perPage }: TaskParams) =>
    axiosInterceptor.get(`api/projects/${projectId}/tasks`, {
      params: { projectId, status, priority, page, perPage },
    }),

  TaskPost: (projectId: string, body: TaskPayload) =>
    axiosInterceptor.post(`api/projects/${projectId}/tasks`, body),
};

export default TaskApi;
