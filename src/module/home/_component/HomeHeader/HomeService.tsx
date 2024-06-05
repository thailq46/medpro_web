/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "./HomeHeader.module.scss";
import {Card, CardContent} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const services = [
  "Đặt khám nhanh",
  "Lấy số thứ tự trực tuyến",
  "Tư vấn sức khỏe từ xa",
  "Tìm kiếm cơ sở y tế",
  "Y tế di động",
  "Y tế điện tử",
  "Đặt lịch xét nghiệm",
];

export default function HomeService() {
  return (
    <div className={styles.services}>
      <Carousel opts={{align: "start"}} className={styles.carousel}>
        <CarouselContent>
          {services.map((v, index) => (
            <CarouselItem key={index} className={styles.carouselItem}>
              <div className="p-1">
                <Card>
                  <CardContent
                    className={`aspect-square px-5 py-4 ${styles.card}`}
                  >
                    <img
                      srcSet="/img/logo.png 2x"
                      className="h-[70px] object-contain"
                    />
                    <span className="block flex-1">{v}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
        <CarouselPrevious />
      </Carousel>
      {/* TABLET */}
      <div className={styles.tablet_servicesContainer}>
        <div className={styles.tablet_services}>
          {services.map((v, index) => (
            <div key={index} className={styles.tablet_serviceBox}>
              <Image
                src="/img/logo.png "
                className="h-[40px] object-contain mt-auto"
                width={100}
                height={100}
                alt="logo"
              />
              <span className="block flex-1">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
