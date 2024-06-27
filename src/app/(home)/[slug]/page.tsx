import apiAppointment from "@/apiRequest/ApiAppointment";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import {AT_COOKIE_NAME} from "@/apiRequest/common";
import Custom404 from "@/components/Layout/ErrorLayout/404";
import VerifyLayout from "@/components/Layout/VerifyLayout";
import ChatPage from "@/module/chat";
import ForgotPassword from "@/module/forgot-password";
import ResetPassword from "@/module/reset-password";
import {cookies} from "next/headers";

export default async function Page({
  params,
  searchParams,
}: {
  params: {slug: string};
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  const cookieStore = cookies();
  const access_token = cookieStore.get(AT_COOKIE_NAME);
  const {slug} = params;
  if (slug === "verify-email") {
    const {token} = searchParams;
    let isError = false;
    try {
      await apiAuthRequest.verifyEmail(token as string);
    } catch (error) {
      isError = true;
      console.log(error);
    }
    return <VerifyLayout isError={isError} />;
  }
  if (slug === "forgot-password") {
    return <ForgotPassword />;
  }
  if (slug === "reset-password") {
    return <ResetPassword />;
  }
  if (slug === "verify-forgot-password") {
    const {token} = searchParams;
    let isError = false;
    try {
      await apiAuthRequest.verifyForgotPassword(token as string);
    } catch (error) {
      isError = true;
      console.log(error);
    }
    return (
      <VerifyLayout
        isError={isError}
        description="Bạn đã xác thực tài khoản thành công. Vui lòng đổi mật khẩu mới...."
        isForgotPassword
        token={token as string}
      />
    );
  }
  if (slug === "payment") {
    const {resultCode, orderId} = searchParams;
    const isSuccess = Number(resultCode) === 0;
    if (isSuccess && access_token) {
      try {
        await apiAppointment.updatePaymentNextServerToServer({
          order_id: orderId as string,
          access_token: access_token?.value,
        });
      } catch (error) {
        console.log(error);
      }
    }
    return (
      <VerifyLayout
        isError={!isSuccess}
        title={`Thanh toán đơn hàng ${orderId} ${
          isSuccess ? "thành công" : "thất bại"
        }`}
        description={`Bạn đã thanh toán đơn hàng ${
          isSuccess ? "thành công" : "thất bại"
        }`}
      />
    );
  }
  if (slug === "chat") {
    return <ChatPage />;
  }
  return <Custom404 />;
}
