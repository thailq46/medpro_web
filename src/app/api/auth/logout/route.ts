import apiAuthRequest from "@/apiRequest/ApiAuth";
import {AT_COOKIE_NAME, RT_COOKIE_NAME} from "@/apiRequest/common";
import {HttpError} from "@/apiRequest/http";
import {cookies} from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const body = await request.json();
  const force = body.force as boolean | undefined;
  // Nếu mà body truyền force lên thì sẽ tự động đăng xuất mà ko cần hỏi
  if (force) {
    cookies().delete(RT_COOKIE_NAME);
    cookies().delete(AT_COOKIE_NAME);
    return Response.json({message: "Bạn buộc phải đăng xuất"}, {status: 200});
  }
  const accessToken = cookieStore.get(AT_COOKIE_NAME);
  const refreshToken = cookieStore.get(RT_COOKIE_NAME);
  if (!accessToken || !refreshToken) {
    return Response.json(
      {message: "Không nhận được access_token và refresh_token"},
      {status: 401}
    );
  }
  try {
    const res = await apiAuthRequest.logoutFromNextServerToNextServer({
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
    });
    cookies().delete(RT_COOKIE_NAME);
    cookies().delete(AT_COOKIE_NAME);
    return Response.json(res.payload, {
      status: 200,
      // headers: {
      //    "Set-Cookie": `accessToken= ; Path=/; HttpOnly; Max-Age=0`,
      // },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json({message: "Lỗi không xác định"}, {status: 500});
    }
  }
}
