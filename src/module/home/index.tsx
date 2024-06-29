"use client";
import HomeAchievement from "@/module/home/_component/HomeAchievement";
import HomeBooking from "@/module/home/_component/HomeBooking";
import HomeDownload from "@/module/home/_component/HomeDownload";
import HomeHeader from "@/module/home/_component/HomeHeader";
import HomeNews from "@/module/home/_component/HomeNews";
import HomeSupport from "@/module/home/_component/HomeSupport";
import dynamic from "next/dynamic";
const HomeHospital = dynamic(
  () => import("@/module/home/_component/HomeHospital"),
  {ssr: false}
);

export default function Home() {
  return (
    <div className="home-container">
      <HomeHeader />
      <HomeHospital />
      <HomeBooking />
      <HomeDownload />
      <HomeAchievement />
      <HomeNews />
      <HomeSupport />
    </div>
  );
}
