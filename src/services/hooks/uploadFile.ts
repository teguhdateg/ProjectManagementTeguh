import { useMutateApi } from "./hooks";
import UploadFileApi from "../api/uploadFileApi";

interface UploadFilePayload {
  body: {
    file: File;
    folder: string;
  };
}

interface UploadFileResponse {
  message: string,
  data: {
    url: string,
    public_id: string,
    resource_type: string
  }
}

type UseUploadFileOptions = {
  onSuccess?: (data: UploadFileResponse, payload: UploadFilePayload) => void;
  onError?: (error: unknown, payload: UploadFilePayload) => void;
};

export const useUploadFile = ({ onSuccess, onError }: UseUploadFileOptions = {}) =>
  useMutateApi<UploadFilePayload, UploadFileResponse>({
    fetch: UploadFileApi.uploadFile,
    key: ["UploadFileApi.uploadFile"],
    onSuccess,
    onError,
  });
