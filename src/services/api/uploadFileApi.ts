import { axiosInterceptor } from "../axios/axiosInterceptor";

interface UploadFile {
  body: {
    file: File;
    folder: string;
  };
}

const UploadFileApi = {
  uploadFile: ({ body }: UploadFile) => {
  const formData = new FormData();
  formData.append("file", body.file);
  if (body.folder) formData.append("folder", body.folder);

  return axiosInterceptor.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
},
};

export default UploadFileApi;
