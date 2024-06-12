import http from "@/apiRequest/http";

export type User = {
  _id?: string;
  name?: string;
  email?: string;
  date_of_birth?: string;
  gender?: number;
  verify?: number;
  address?: string;
  username?: string;
  avatar?: string;
  role?: number;
  phone_number?: string;
  position?: number;
  created_at?: string;
  updated_at?: string;
};

interface ILoginBody {
  email: string;
  password: string;
}
interface IUpdateMeBody {
  username?: string;
  name?: string;
  avatar?: string;
  gender?: number;
  date_of_birth?: string;
  phone_number?: string;
  address?: string;
}
interface IChangePasswordBody {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}
interface IRegisterBody {
  email: string;
  password: string;
  confirm_password: string;
  name: string;
  date_of_birth: string;
  gender: number;
}
interface ILoginResponse {
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    role: number;
  };
}
interface IRegisterResponse {
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    email_verify_token: string;
  };
}
export interface IGetMeResBody {
  message: string;
  data: User;
}

const path = {
  login: "/auth/login",
  register: "/auth/register",
  resendVerifyEmail: "/auth/resend-verify-email",
  verifyEmail: "/auth/verify-email",
  changePassword: "/auth/change-password",
  getMe: "/users/me",
  updateMe: "/users/me",
  logout: "/auth/logout",
};

const apiAuthRequest = {
  login: (body: ILoginBody) => http.post<ILoginResponse>(path.login, body),

  register: (body: IRegisterBody) =>
    http.post<IRegisterResponse>(path.register, body),

  auth: (body: {
    access_token: string;
    refresh_token: string;
    expiresAt: number;
  }) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),

  getMeFromNextServerToServer: (access_token: string) =>
    http.get<IGetMeResBody>(path.getMe, {
      headers: {Authorization: `Bearer ${access_token}`},
      cache: "no-cache",
    }),

  updateMe: (body: IUpdateMeBody) =>
    http.patch<IGetMeResBody>(path.updateMe, body),

  changePassword: (body: IChangePasswordBody) =>
    http.put<{message: string}>(path.changePassword, body),

  resendVerifyEmail: () =>
    http.post<{message: string}>(path.resendVerifyEmail, {}),

  verifyEmail: (email_verify_token: string) =>
    http.post<{message: string}>(path.verifyEmail, {
      email_verify_token,
    }),

  logoutFromNextClientToNextServer: (
    force?: boolean | undefined,
    signal?: AbortSignal | undefined
  ) =>
    http.post(
      "api/auth/logout",
      {force},
      {
        baseUrl: "",
        signal,
      }
    ),
  logoutFromNextServerToNextServer: ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => {
    return http.post<{message: string}>(
      path.logout,
      {refresh_token: refreshToken},
      {headers: {Authorization: `Bearer ${accessToken}`}}
    );
  },
};

export default apiAuthRequest;
