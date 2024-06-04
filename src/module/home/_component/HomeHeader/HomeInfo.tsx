/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "./HomeHeader.module.scss";
import {Button} from "@/components/ui/button";

export default function HomeInfo() {
  return (
    <div className={styles.homeInfo}>
      <div className={styles.homeHeader}>
        <div className="basis-[100%]">
          <img
            srcSet="/img/logo.png 2x"
            alt="Logo"
            className="w-[170px] h-[50px] object-contain"
          />
          <span className={styles.homeHeaderTitle}>Đặt khám nhanh</span>
        </div>
        <p>
          <strong>Medpro</strong> cung cấp dịch vụ đặt lịch khám bệnh và chăm
          sóc sức khỏe trực tuyến tại các bệnh viện hàng đầu Việt Nam như Bệnh
          viện Đại học Y Dược TP.HCM, Bệnh viện Chợ Rẫy và Bệnh viện Nhi Đồng,
          giúp người dùng tự lựa chọn dịch vụ và bác sĩ theo nhu cầu của mình.
        </p>
      </div>
      <div className={styles.homeCard}>
        {Array.from({length: 3}).map((_, index) => (
          <div className={styles.homeCardBox} key={index}>
            <div className="h-[260px] w-full">
              <img
                src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F1af3c257-01f4-4035-a832-6cd3c25aecce-frame_1000001919.webp&w=1920&q=75"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <h4 className={styles.homeTitle}>Vì thời gian của bạn là vô giá</h4>
            <span className={styles.homeDesc}>
              Bệnh nhân chủ động chọn thông tin đặt khám (ngày khám và giờ khám)
            </span>
            <Button>Xem thêm</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
