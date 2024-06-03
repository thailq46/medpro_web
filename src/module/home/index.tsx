"use client";
import HomeBooking from "@/module/home/_component/HomeBooking";
import HomeDownload from "@/module/home/_component/HomeDownload";
import HomeHeader from "@/module/home/_component/HomeHeader";
import HomeHospital from "@/module/home/_component/HomeHospital";

export default function Home() {
  return (
    <div className="home-container">
      <HomeHeader />
      <HomeHospital />
      <HomeBooking />
      <HomeDownload />
    </div>
  );
}
