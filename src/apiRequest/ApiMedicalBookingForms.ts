import {CommonParams, ICommonAuditable, IMetaData} from "@/apiRequest/common";
import http from "@/apiRequest/http";

export interface IMedicalBookingFormsRes extends ICommonAuditable {
  _id?: string;
  name?: string;
  slug?: string;
  image?: string;
}
export interface IParamsMedicalBookingForms {
  limit?: number;
  page?: number;
  search?: string;
}
export interface IGetListMedicalBookingFormsRes {
  message: string;
  data: IMedicalBookingFormsRes[];
  meta: IMetaData;
}

const path = {
  root: "/api/medical-booking-forms",
};

const apiMedicalBookingForms = {
  getListMedicalBookingForms: (params?: IParamsMedicalBookingForms) => {
    return http.get<IGetListMedicalBookingFormsRes>(path.root, {
      params: params as CommonParams<IParamsMedicalBookingForms>,
    });
  },
};

export default apiMedicalBookingForms;
