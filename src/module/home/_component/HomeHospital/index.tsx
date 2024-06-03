import React from "react";
import styles from "./HomeHospital.module.scss";
import {Card, CardContent} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function HomeHospital() {
  const hospital = [
    {
      name: "Bệnh viện Bạch Mai",
      address: "78 Giải Phóng, Đống Đa, Hà Nội",
    },
    {
      name: "Bệnh viện Chợ Rẫy",
      address: "201B Nguyễn Chí Thanh, Quận 5, TP. Hồ Chí Minh",
    },
    {
      name: "Bệnh viện Việt Đức",
      address: "40 Tràng Thi, Hoàn Kiếm, Hà Nội",
    },
    {
      name: "Bệnh viện Đại học Y Dược TP. Hồ Chí Minh",
      address: "215 Hồng Bàng, Quận 5, TP. Hồ Chí Minh",
    },
    {
      name: "Bệnh viện 108",
      address: "1 Trần Hưng Đạo, Hai Bà Trưng, Hà Nội",
    },
    {
      name: "Bệnh viện Nhi Trung ương",
      address: "18/879 La Thành, Đống Đa, Hà Nội",
    },
    {
      name: "Bệnh viện Phụ sản Trung ương",
      address: "43 Tràng Thi, Hoàn Kiếm, Hà Nội",
    },
    {
      name: "Bệnh viện Hữu nghị Việt Tiệp",
      address: "1 Phố Nhà Thương, Lê Chân, Hải Phòng",
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Bệnh viện tiêu biểu</h2>
      <span className={styles.desc}>
        Đặt lịch khám với hơn 70 bệnh viện trên khắp cả nước
      </span>
      <Carousel
        opts={{align: "start"}}
        className="w-full mx-auto relative top-[50px]"
      >
        <CarouselContent>
          {hospital.map((v, index) => (
            <CarouselItem key={index} className="basis-1/4">
              <div className="p-1">
                <Card className="shadow-none border-none">
                  <CardContent className={`aspect-square p-0 ${styles.card}`}>
                    <div className={styles.cardImage}>
                      <img
                        srcSet="https://source.unsplash.com/random 2x"
                        alt="hospital"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className={styles.cardName}>{v.name}</h3>
                      <p className={styles.cardAddress}>{v.address}</p>
                    </div>
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
