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
      <Carousel
        opts={{align: "start"}}
        className="w-full max-w-[1180px] mx-auto relative top-[50px]"
      >
        <CarouselContent>
          {services.map((v, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/6">
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
