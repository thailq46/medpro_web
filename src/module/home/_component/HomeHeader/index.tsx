/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import {Input} from "@/components/ui/input";
import styles from "./HomeHeader.module.scss";
import HomeStatistic from "@/module/home/_component/HomeHeader/HomeStatistic";
import HomeInfo from "@/module/home/_component/HomeHeader/HomeInfo";
import HomeService from "@/module/home/_component/HomeHeader/HomeService";

export default function HomeHeader() {
  return (
    <section className={`home-header ${styles.container}`}>
      <div className={styles.banner}>
        <div className={styles.content}>
          <span className="text-[#11a2f3] text-[25px] mb-2">
            Nền tảng công nghệ
          </span>
          <h3 className={styles.title}>
            Kết nối người dân với Cơ sở - Dịch vụ Y tế
          </h3>
          <div className={styles.search}>
            <Input type="text" placeholder="Tìm kiếm cơ sở y tế" />
          </div>
          <span className="text-xl">
            Đặt khám nhanh - Lấy số thứ tự trực tuyến - Tư vấn sức khỏe từ xa
          </span>
        </div>
        <HomeService />
      </div>
      <div className={styles.main}>
        <HomeInfo />
        <HomeStatistic />
      </div>
    </section>
  );
}
