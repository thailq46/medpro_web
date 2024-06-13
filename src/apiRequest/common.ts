export const RT_COOKIE_NAME = "refreshToken";
export const AT_COOKIE_NAME = "accessToken";

export type ParamsType = Record<
  string,
  string | number | boolean | string[] | number[] | boolean[]
>;
export enum IStatus {
  SUCCESS = 200,
  ERROR = 400,
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
