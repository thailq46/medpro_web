import {ICommonAuditable} from "@/apiRequest/common";
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

export interface IGetListSpecialtyRes {
  message: string;
  data: ISpecialtyBody[];
}

const path = {
  root: "/specialties",
  getByHospitalId: "/specialties/hospital",
};

const apiSpecialty = {
  getListSpecialtyByHospitalId: (hospitalId: string) => {
    return http.get<IGetListSpecialtyRes>(
      `${path.getByHospitalId}/${hospitalId}`
    );
  },
};

export default apiSpecialty;
