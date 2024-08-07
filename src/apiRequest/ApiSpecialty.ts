import {CommonParams, ICommonAuditable} from "@/apiRequest/common";
import http from "@/apiRequest/http";

export interface ISpecialtyBody extends ICommonAuditable {
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
  hospital?: {
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
    categoryId?: string;
    booking_forms?: {
      image?: string;
      name?: string;
    }[];
    updated_at?: string;
    created_at?: string;
  };
}
interface ParamsSpecialtyByHospitalId {
  search?: string;
}
export interface IGetListSpecialtyRes {
  message: string;
  data: ISpecialtyBody[];
}

const path = {
  root: "/api/specialties",
  getByHospitalId: "/api/specialties/hospital",
};

const apiSpecialty = {
  getListSpecialtyByHospitalId: ({
    hospitalId,
    params,
  }: {
    hospitalId: string;
    params?: ParamsSpecialtyByHospitalId;
  }) => {
    return http.get<IGetListSpecialtyRes>(
      `${path.getByHospitalId}/${hospitalId}`,
      {params: params as CommonParams<ParamsSpecialtyByHospitalId>}
    );
  },
};

export default apiSpecialty;
