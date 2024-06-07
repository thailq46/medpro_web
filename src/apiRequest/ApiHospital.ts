import {ICategoryBody} from "@/apiRequest/ApiCategory";
import {CommonParams, ICommonAuditable, IMetaData} from "@/apiRequest/common";
import http from "@/apiRequest/http";

export interface IHospitalBody extends ICommonAuditable {
  _id?: string;
  name?: string;
  session?: string;
  slug?: string;
  description?: string;
  hotline?: string;
  start_time?: string;
  end_time?: string;
  address?: string;
  avatar?: string;
  banner?: string;
  images?: string[];
  types?: number[];
  category?: ICategoryBody;
  booking_forms?: {
    id?: string;
    name?: string;
    image?: string;
  }[];
}

export interface IParamsHospital {
  limit?: number;
  page?: number;
  search?: string;
  types?: string;
}

interface IGetListHospitalRes {
  message: string;
  data: IHospitalBody[];
  meta: IMetaData;
}
export interface IGetHospitalRes {
  message: string;
  data: IHospitalBody;
}
const path = {
  root: "/hospitals",
  getBySlug: "/hospitals/slug",
};

const apiHospital = {
  getListHospital: (params: IParamsHospital) => {
    return http.get<IGetListHospitalRes>(path.root, {
      params: params as CommonParams<IParamsHospital>,
      cache: "no-cache",
    });
  },
  getHospitalBySlug: (slug: string) => {
    return http.get<IGetHospitalRes>(`${path.getBySlug}/${slug}`);
  },
};

export default apiHospital;
