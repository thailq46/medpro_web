"use client";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import HomeAchievement from "@/module/home/_component/HomeAchievement";
import HomeBooking from "@/module/home/_component/HomeBooking";
import HomeDownload from "@/module/home/_component/HomeDownload";
import HomeHeader from "@/module/home/_component/HomeHeader";
import HomeHospital from "@/module/home/_component/HomeHospital";
import HomeNews from "@/module/home/_component/HomeNews";
import HomeSupport from "@/module/home/_component/HomeSupport";

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
