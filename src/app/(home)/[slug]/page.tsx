import apiAuthRequest from "@/apiRequest/ApiAuth";
import VerifyLayout from "@/components/Layout/VerifyLayout";
import ForgotPassword from "@/module/forgot-password";
import ResetPassword from "@/module/reset-password";

export default async function Page({
  params,
  searchParams,
}: {
  params: {slug: string};
  searchParams: {[key: string]: string | string[] | undefined};
}) {
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
  return <div>{slug}</div>;
}
