"use client";
import apiMedicalBookingForms from "@/apiRequest/ApiMedicalBookingForms";
import {Card, CardContent} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import {useQuery} from "@tanstack/react-query";
import Image from "next/image";
import styles from "./HomeHeader.module.scss";

export default function HomeService() {
  const {data: medicalBookingForms} = useQuery({
    queryKey: [QUERY_KEY.GET_LIST_MEDICAL_BOOKING_FORMS],
    queryFn: async () =>
      await apiMedicalBookingForms.getListMedicalBookingForms({
        limit: 99,
        page: 1,
      }),
  });
  return (
    <div className={styles.services}>
      <Carousel opts={{align: "center"}} className={styles.carousel}>
        <CarouselContent>
          {medicalBookingForms?.payload?.data.map((v) => (
            <CarouselItem key={v._id} className={styles.carouselItem}>
              <div className="p-1">
                <Card>
                  <CardContent
                    className={`aspect-square px-5 py-4 ${styles.card}`}
                  >
                    <Image
                      src={v.image ?? "/img/logo.png"}
                      width={100}
                      height={100}
                      alt="logo"
                      className="h-[70px] object-contain"
                    />
                    <span className="block flex-1">{v.name}</span>
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
          {medicalBookingForms?.payload?.data.map((v) => (
            <div key={v._id} className={styles.tablet_serviceBox}>
              <Image
                src={v.image ?? "/img/logo.png"}
                className="h-[40px] object-contain mt-auto"
                width={100}
                height={100}
                alt="logo"
              />
              <span className="block flex-1">{v.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
