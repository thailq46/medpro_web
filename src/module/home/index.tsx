"use client";
import React from "react";
import HomeHeader from "@/module/home/_component/HomeHeader";
import HomeHospital from "@/module/home/_component/HomeHospital";

export default function Home() {
  return (
    <div className="home-container">
      <HomeHeader />
      <HomeHospital />
    </div>
  );
}
