import {IStatus, RT_COOKIE_NAME} from "@/apiRequest/common";
import {cookies} from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("request ~ body", body);
  const access_token = body?.access_token as string;
  const refresh_token = body?.refresh_token as string;
  const expiresAt = body?.expiresAt as number;
  if (!access_token && !refresh_token) {
    return Response.json(
      {message: "Không nhận được access_token và refresh_token"},
      {status: IStatus.ERROR}
    );
  }
  cookies().set(RT_COOKIE_NAME, refresh_token, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "lax",
  });
  const expiredDate = new Date(expiresAt * 1000).toUTCString();
  return Response.json(body, {
    status: IStatus.SUCCESS,
    headers: {
      "Set-Cookie": `accessToken=${access_token}; Path=/; HttpOnly; Expires=${expiredDate}; SameSite=Lax; Secure`,
    },
  });
}
