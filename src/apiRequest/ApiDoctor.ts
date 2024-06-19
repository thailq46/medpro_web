import {CommonParams, ICommonAuditable, IMetaData} from "@/apiRequest/common";
import http from "@/apiRequest/http";

export interface IParamsDoctor {
  limit: number;
  page: number;
  search?: string;
  hospital?: string;
  specialty?: string;
}
/**
 * The gender and position are a string, and in the backend controller, it will be converted to a number. If the gender and position string are 'null', it will be converted to null.
 */
export interface QueryDoctorsBySpecialty {
  hospital_id: string;
  specialty_id: string;
  search?: string;
  gender?: string;
  position?: string;
}
interface QueryDoctorsByHospital {
  search?: string;
  gender?: string;
  position?: string;
}
interface QueryDoctors {
  limit?: number;
  page?: number;
  hospital?: string;
  specialty?: string;
  search?: string;
  position?: string;
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
export interface IGetListDoctorRes {
  message: string;
  data: IDoctorBody[];
  meta: IMetaData;
}

const path = {
  root: "/doctors",
  getListDoctorBySpecialtyId: "/doctors/specialty",
  getListDoctorByHospitalId: "/doctors/hospital",
};

const apiDoctor = {
  getListDoctor: (params: QueryDoctors) =>
    http.get<IGetListDoctorRes>(path.root, {
      params: params as CommonParams<QueryDoctors>,
    }),

  getListDoctorBySpecialtyId: (params: QueryDoctorsBySpecialty) => {
    return http.get<Omit<IGetListDoctorRes, "meta">>(
      path.getListDoctorBySpecialtyId,
      {
        params: params as CommonParams<QueryDoctorsBySpecialty>,
      }
    );
  },

  getListDoctorByHospitalId: ({
    hospital_id,
    params,
  }: {
    hospital_id: string;
    params?: QueryDoctorsByHospital;
  }) => {
    return http.get<Omit<IGetListDoctorRes, "meta">>(
      `${path.getListDoctorByHospitalId}/${hospital_id}`,
      {params: params as CommonParams<QueryDoctorsByHospital>}
    );
  },
};

export default apiDoctor;
