import {CommonParams, ICommonAuditable} from "@/apiRequest/common";
import http from "@/apiRequest/http";

export interface IParamsDoctor {
  limit: number;
  page: number;
  search?: string;
  hospital?: string;
  specialty?: string;
}
export interface QueryDoctorsBySpecialty {
  hospital_id: string;
  specialty_id: string;
  search?: string;
}
export interface IDoctorBody extends ICommonAuditable {
  _id?: string;
  hospital_id?: string;
  address?: string;
  avatar?: string;
  date_of_birth?: string;
  description?: string;
  doctor_id?: string;
  email?: string;
  gender?: number;
  name?: string;
  phone_number?: string;
  position?: number;
  price?: number;
  role?: number;
  session?: string;
  therapy?: string;
  username?: string;
  specialty?: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    updated_at?: string;
    created_at?: string;
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
  };
}
export interface IGetListDoctorBySpecialtyIdRes {
  message: string;
  data: IDoctorBody[];
}

const path = {
  root: "/doctors",
  getListDoctorBySpecialtyId: "/doctors/specialty",
};

const apiDoctor = {
  getListDoctorBySpecialtyId: (params: QueryDoctorsBySpecialty) => {
    return http.get<IGetListDoctorBySpecialtyIdRes>(
      path.getListDoctorBySpecialtyId,
      {
        params: params as CommonParams<QueryDoctorsBySpecialty>,
      }
    );
  },
};

export default apiDoctor;
