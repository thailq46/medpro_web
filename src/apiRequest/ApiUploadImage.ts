import http from "@/apiRequest/http";

interface IUploadImageRes {
  message: string;
  data: {
    url?: string;
    type?: number;
  }[];
}
const path = {
  root: "/medias/upload-image",
};

export const uploadImage = async (body: FormData) => {
  return http.post<IUploadImageRes>(path.root, body);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {uploadImage};
