import {ICommonAuditable} from "@/apiRequest/common";
import http from "@/apiRequest/http";

export interface IAppointmentBody extends ICommonAuditable {
  _id?: string;
  doctor_id?: string;
  patient_id?: string;
  service_id?: string;
  doctor?: {
    _id?: string;
    address?: string;
    avatar?: string;
    description?: string;
    doctor_id?: string;
    email?: string;
    gender?: number;
    hospital_id?: string;
    name?: string;
    phone_number?: string;
    position?: number;
    price?: number;
    role?: number;
    session?: string;
    specialty_id?: string;
    therapy?: string;
    username?: string;
    date_of_birth?: string;
    created_at?: string;
    updated_at?: string;
  };
  service?: {
    _id?: string;
    description?: string;
    hospital_id?: string;
    name?: string;
    note?: string;
    price?: number;
    session?: string;
    specialty_id?: string;
    type?: string;
    created_at?: string;
    updated_at?: string;
  };
  status?: boolean;
  email?: string;
  fullname?: string;
  gender?: number;
  date_of_birth?: string;
  price?: number;
  reason?: string;
  isPayment?: boolean;
  date?: string;
  time?: string;
  address?: string;
  order_id?: string | null;
}
interface ICreateAppointmentBody {
  doctor_id?: string;
  patient_id?: string;
  service_id?: string;
  address?: string;
  date?: string;
  time?: string;
  date_of_birth?: string;
  email?: string;
  fullname?: string;
  gender?: number;
  phone_number?: string;
  price?: number;
  reason?: string;
  status?: boolean;
  isPayment?: boolean;
}

interface IGetAppointmentByPatientIdRes {
  message: string;
  data: IAppointmentBody[];
}

const path = {
  create: "appointments/create",
  getByPatientId: "appointments/patient",
  update: "appointments/update",
};

const apiAppointment = {
  create: (body: ICreateAppointmentBody) =>
    http.post<{message: string}>(path.create, body),

  getByPatientId: (patient_id: string) =>
    http.get<IGetAppointmentByPatientIdRes>(
      `${path.getByPatientId}/${patient_id}`
    ),

  updateOrderId: ({id, order_id}: {id: string; order_id: string}) =>
    http.patch<{message: string}>(`${path.update}/${id}/order-id`, {
      order_id,
    }),
  updatePaymentNextServerToServer: ({
    order_id,
    access_token,
  }: {
    order_id: string;
    access_token: string;
  }) =>
    http.patch<{message: string}>(
      `${path.update}/${order_id}/payment`,
      {},
      {headers: {Authorization: `Bearer ${access_token}`}}
    ),
};

export default apiAppointment;
