import http from "@/apiRequest/http";

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

const path = {
  create: "appointments/create",
};

const apiAppointment = {
  create: (body: ICreateAppointmentBody) =>
    http.post<{message: string}>(path.create, body),
};

export default apiAppointment;
