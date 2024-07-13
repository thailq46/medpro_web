import apiHospital from "@/apiRequest/ApiHospital";
import {ACCESS_TOKEN, QUERY_PARAMS} from "@/apiRequest/common";
import {baseOpenGraph} from "@/app/(home)/shared-metadata";
import {Metadata} from "next";
import dynamic from "next/dynamic";
import {cookies} from "next/headers";
import {cache} from "react";
const Custom404 = dynamic(() => import("@/components/Layout/ErrorLayout/404"));
const VerifyLayout = dynamic(() => import("@/components/Layout/VerifyLayout"));
const ChatPage = dynamic(() => import("@/module/chat"));
const ForgotPassword = dynamic(() => import("@/module/forgot-password"));
const ResetPassword = dynamic(() => import("@/module/reset-password"));
const HospitalDetail = dynamic(() => import("@/module/hospital-detail"));

type Props = {
  params: {slug: string};
  searchParams: {[key: string]: string | string[] | undefined};
};

const getListHospital = cache(apiHospital.getListHospital);

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = params;
  const {payload} = await getListHospital(QUERY_PARAMS);
  const hospitals = payload?.data;
  const hospital = hospitals.find((item) => item.slug === slug);
  if (hospital) {
    const url = `https://lequangthai-medpro/${hospital.slug}`;
    return {
      category: "Cơ sở y tế",
      title: hospital.name,
      description: hospital.description,
      openGraph: {
        title: hospital.name,
        description: hospital.description,
        url, // URL khi deploy lên production
        siteName: "Cơ sở y tế - Đặt lịch khám bệnh",
        images: [
          {
            url: hospital.avatar || "",
            width: 1800,
            height: 1600,
            alt: hospital.name,
          },
        ],
        ...baseOpenGraph,
      },
      alternates: {
        canonical: {
          url,
        },
      },
    };
  }
  return {};
}

export default async function Page({params, searchParams}: Props) {
  const cookieStore = cookies();
  const access_token = cookieStore.get(ACCESS_TOKEN);
  const {slug} = params;
  const hospitals = await getListHospital(QUERY_PARAMS);
  const hospital = hospitals.payload.data.find((value) => value.slug === slug);

  if (slug === "verify-email") {
    const {token} = searchParams;
    let isError = false;
    try {
      const apiAuthRequest = (await import("@/apiRequest/ApiAuth")).default;
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
      const apiAuthRequest = (await import("@/apiRequest/ApiAuth")).default;
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
        const apiAppointment = (await import("@/apiRequest/ApiAppointment"))
          .default;
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
  if (!hospital) {
    return <Custom404 />;
  }
  return <HospitalDetail hospital={hospital} />;
}
