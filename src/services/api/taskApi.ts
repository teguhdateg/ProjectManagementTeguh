import { axiosInterceptor } from "../axios/axiosInterceptor";

interface TaskParams {
  projectId: string;
  status: string;
  priority: string;
  page: number;
  perPage: number;
}

const TaskApi = {
  TaskGet: ({projectId, status, priority, page, perPage }: TaskParams) =>
    axiosInterceptor.get(`api/projects/${projectId}/tasks`, {
      params: {projectId, status, priority, page, perPage },
    }),
};

export default TaskApi;
