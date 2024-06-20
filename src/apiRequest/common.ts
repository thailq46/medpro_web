export const RT_COOKIE_NAME = "refreshToken";
export const AT_COOKIE_NAME = "accessToken";

export type ParamsType = Record<
  string,
  string | number | boolean | string[] | number[] | boolean[]
>;

export enum IStatus {
  SUCCESS = 200,
  ERROR = 400,
  UNAUTHORIZED = 401,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export interface IMetaData {
  total_page?: number;
  limit?: number;
  current_page?: number;
  total_items?: number;
}

export interface ICommonAuditable {
  key?: number | string;
  created_at?: string;
  updated_at?: string;
}

export type CommonParams<T> = Record<
  keyof T,
  string | number | boolean | string[] | number[] | boolean[]
>;

export enum HospitalsType {
  BENHVIENCONG = 0,
  BENHVIENTU = 1,
  PHONGKHAM = 2,
  PHONGMACH = 3,
  XETNGHIEM = 4,
  YTETAINHA = 5,
  TIEMCHUNG = 6,
}

export enum PositionType {
  NONE = 0, // Người dùng
  MASTER = 1, // Thạc sĩ
  DOCTOR = 2, // Tiến sĩ
  ASSOCIATE_PROFESSOR = 3, // Phó giáo sư
  PROFESSOR = 4, // Giáo sư
}
export enum VerifyStatus {
  UNVERIFIED = 0, // chưa xác thực email, mặc định = 0
  VERIFIED = 1, // đã xác thực emails
  BANNED = 2, // bị khoá
}

export enum RoleType {
  Admin = 0,
  Doctor = 1,
  User = 2,
}

export const PAGE = 1;
export const LIMIT = 10;
export const QUERY_PARAMS = {
  page: 1,
  limit: 99,
} as const;

export const PARAMS = {
  FEATURE: "feature",
  HOSPITAL_ID: "hospitalId",
  STEP_NAME: "stepName",
  SPECIALTY_ID: "specialtyId",
  DOCTOR_ID: "doctorId",
  SERVICE_ID: "serviceId",
} as const;

export const BOOKING = {
  DATE: "booking.date",
  DOCTOR: "booking.doctor",
  VACCINE: "booking.vaccine",
  PACKAGE: "booking.package",
} as const;

export const STEP_NAME = {
  SUBJECT: "subject",
  DOCTOR: "doctor",
  SERVICE: "service",
  DATE: "date",
  TIME: "time",
} as const;

export const TYPE_SERVICE = {
  SERVICE: "service",
  PACKAGE: "package",
  VACCINE: "vaccine",
} as const;

export const LIST_POSITION_DOCTOR = [
  {
    value: PositionType.MASTER,
    label: "Thạc sĩ",
  },
  {
    value: PositionType.DOCTOR,
    label: "Tiến sĩ",
  },
  {
    value: PositionType.ASSOCIATE_PROFESSOR,
    label: "Phó giáo sư",
  },
  {
    value: PositionType.PROFESSOR,
    label: "Giáo sư",
  },
];
