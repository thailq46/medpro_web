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
