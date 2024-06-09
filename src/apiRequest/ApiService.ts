import {ICommonAuditable} from "@/apiRequest/common";
import http from "@/apiRequest/http";

export interface IServiceBody extends ICommonAuditable {
  _id?: string;
  name?: string;
  description?: string;
  note?: string;
  price?: number;
  session?: string;
  specialty?: {
    _id?: string;
    description?: string;
    hospital_id?: string;
    name?: string;
    slug?: string;
    created_at?: string;
    updated_at?: string;
  };
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
    booking_forms?: string[];
    updated_at?: string;
    created_at?: string;
  };
}

interface IGetListServiceRes {
  message: string;
  data: IServiceBody[];
}
interface IGetServiceRes {
  message: string;
  data: IServiceBody;
}
const path = {
  root: "/services",
  getFullServiceByHospitalId: "/services/hospital",
};

const apiService = {
  getFullServiceByHospitalId: (hospitalId: string) => {
    return http.get<IGetListServiceRes>(
      `${path.getFullServiceByHospitalId}/${hospitalId}`
    );
  },
  getServiceById: (id: string) => {
    return http.get<IGetServiceRes>(`${path.root}/${id}`);
  },
};

export default apiService;
