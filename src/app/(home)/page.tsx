import HomeAchievement from "@/module/home/_component/HomeAchievement";
import HomeBooking from "@/module/home/_component/HomeBooking";
import HomeDownload from "@/module/home/_component/HomeDownload";
import HomeHeader from "@/module/home/_component/HomeHeader";
import HomeHospital from "@/module/home/_component/HomeHospital";
import HomeNews from "@/module/home/_component/HomeNews";
import HomeSupport from "@/module/home/_component/HomeSupport";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Đăng ký khám, đặt lịch khám hơn 100 bệnh viện lớn tại Việt Nam",
  description:
    "Medpro, đăng ký trực tuyến, tổng đài đặt lịch khám nhanh 19002115, lấy số thứ tự khám nhanh chóng và tiện lợi tại các Bệnh viện Đại học Y Dược TP HCM, Chợ Rẫy, Mắt TP HCM, Da liễu TP, Nhi Đồng 1. Được tạo bởi Lê Quang Thái",
};

export default async function Home({
  searchParams,
}: {
  searchParams?: {[key: string]: string | string[] | undefined};
}) {
  const searchKey = (searchParams?.search_key || "") as string;

  return (
    <div className="home-container">
      <HomeHeader searchKey={searchKey} />
      <HomeHospital />
      <HomeBooking />
      <HomeDownload />
      <HomeAchievement />
      <HomeNews />
      <HomeSupport />
    </div>
  );
}
