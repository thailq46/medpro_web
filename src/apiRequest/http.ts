import displayError from "@/apiRequest/ErrorMessage/errors";
import {IStatus, ParamsType} from "@/apiRequest/common";
import {toast} from "@/components/ui/use-toast";
import {redirect} from "next/navigation";

type EntityErrorPayload = {
  message: string;
  errors: {
    [key: string]: {
      msg: string | {message: string; status: number};
      path: string;
      [key: string]: any;
    };
  };
};

export interface IDataError {
  errorCode: string;
  errorMessage?: any;
}

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({status, payload}: {status: number; payload: any}) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status = 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: number;
    payload: EntityErrorPayload;
  }) {
    super({status, payload});
    this.status = status;
    this.payload = payload;
  }
}

type CustomOptions = Omit<IFetcherOptions, "method"> & {
  baseUrl?: string | undefined;
};

export const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;
const BAD_REQUEST_ERROR_STATUS = 400;

interface IFetcherOptions extends RequestInit {
  params?: ParamsType;
}

class AccessToken {
  private token = "";
  private _expiresAt = 0;
  get value() {
    return this.token;
  }
  set value(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this.token = token;
  }
  get expiresAt() {
    return this._expiresAt;
  }
  set expiresAt(_expiresAt: number) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this._expiresAt = _expiresAt;
  }
}
export const clientAccessToken = new AccessToken();

let clientLogoutRequest: null | Promise<any> = null;

const request = async <TResponse>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  options?: CustomOptions | undefined
): Promise<{status: number; payload: TResponse}> => {
  /**
   * Nếu không truyền baseUrl hoặc baseUrl = undefined thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
   * Nếu truyền baseUrl thì lấy từ baseUrl, truyền vào rỗng thì đồng nghĩa với việc gọi api đến next server
   */
  const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  let fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

  if (options?.params) {
    const queryString = new URLSearchParams(options.params as any).toString();
    fullUrl += `?${queryString}`;
  }
  // fullUrl = http://localhost:4004/users?limit=5&page=1

  // Đối với upload file thì ko thể dùng JSON.stringify nên phải check xem body có FormData hay không
  const body = options?.body
    ? options?.body instanceof FormData
      ? options?.body
      : JSON.stringify(options.body)
    : undefined;
  const baseHeaders =
    options?.body instanceof FormData
      ? {
          Authorization: `Bearer ${clientAccessToken.value}`,
        }
      : {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${clientAccessToken.value}`,
        };
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    method,
    body,
  });

  const payload: TResponse = await res.json();
  console.log("request ~ payload", payload);
  const data = {
    status: res.status,
    payload,
  };

  // Interceptor
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      const dataError: IDataError = {
        errorCode: "unique.ValidatorInvalid",
        errorMessage: "Lỗi validate",
      };
      displayError(dataError);
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (typeof window !== undefined) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({force: true}),
            headers: {
              ...baseHeaders,
            } as any,
          });
          await clientLogoutRequest;
          clientLogoutRequest = null;
          clientAccessToken.value = "";
          clientAccessToken.expiresAt = 0;
          location.href = "/login";
        } else {
          redirect(`/login`);
        }
      }
    } else if (res.status === BAD_REQUEST_ERROR_STATUS) {
      toast({
        title: "Lỗi 400",
        description: (data.payload as any).message || "Xóa thất bại",
        duration: 3000,
        variant: "destructive",
      });
      throw data;
    } else {
      throw new HttpError(data);
    }
  }
  if (data.payload === undefined) {
    const dataEmpty: IDataError = {
      errorCode: "ERROR???",
      errorMessage: "Data is empty",
    };
    displayError(dataEmpty);
    throw new HttpError({status: IStatus.SUCCESS, payload: dataEmpty});
  }
  return data;
};

const http = {
  get<TResponse>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<TResponse>("GET", url, options);
  },
  post<TResponse>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<TResponse>("POST", url, {...options, body});
  },
  put<TResponse>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<TResponse>("PUT", url, {...options, body});
  },
  patch<TResponse>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<TResponse>("PATCH", url, {...options, body});
  },
  delete<TResponse>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<TResponse>("DELETE", url, {...options});
  },
};

export default http;
