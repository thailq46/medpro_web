import {CommonParams, ICommonAuditable, IMetaData} from "@/apiRequest/common";
import http from "@/apiRequest/http";

export interface IParamsCategories {
  limit?: number;
  page?: number;
  search?: string;
}
export interface ICategoryBody extends ICommonAuditable {
  _id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

export interface IGetListCategoryRes {
  message: string;
  data: ICategoryBody[];
  meta: IMetaData;
}
const path = {
  root: "/categories",
};

const apiCategoryRequest = {
  getListCategory: (params?: IParamsCategories) =>
    http.get<IGetListCategoryRes>(path.root, {
      params: params as CommonParams<IParamsCategories>,
      cache: "no-store",
    }),
};

export default apiCategoryRequest;
