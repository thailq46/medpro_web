import {CommonParams, ICommonAuditable, IMetaData} from "@/apiRequest/common";
import http from "@/apiRequest/http";

export interface IScheduleBody extends ICommonAuditable {
  _id?: string;
  doctor_id?: string;
  date?: string;
  time_type?: string[];
}

export interface IParamsSchedule {
  limit: number;
  page: number;
  doctor_id?: string;
  date?: string;
}
export type IParamsScheduleByDoctorID = Omit<IParamsSchedule, "doctor_id">;

interface IGetListScheduleResponse {
  data: IScheduleBody[];
  message: string;
  meta: IMetaData;
}

const path = {
  root: "/schedules",
  getScheduleByDoctorId: "/schedules/doctor",
};

const apiSchedule = {
  getListScheduleByDoctorId: ({
    doctor_id,
    params,
  }: {
    doctor_id: string;
    params: IParamsScheduleByDoctorID;
  }) => {
    return http.get<IGetListScheduleResponse>(
      `${path.getScheduleByDoctorId}/${doctor_id}`,
      {params: params as CommonParams<IParamsScheduleByDoctorID>}
    );
  },
};

export default apiSchedule;
