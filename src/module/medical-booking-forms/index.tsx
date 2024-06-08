"use client";
import {IGetHospitalRes} from "@/apiRequest/ApiHospital";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Button} from "@/components/ui/button";
import {ResetIcon} from "@radix-ui/react-icons";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import styles from "./Booking.module.scss";
export default function MedicalBookingForms({
  hospital,
}: {
  hospital: IGetHospitalRes["data"];
}) {
  const router = useRouter();
  if (!hospital) router.push("/500");
  const generateQueryString = () => {
    const query = new URLSearchParams();
    let feature = "";
    hospital.booking_forms?.forEach((v) => {
      if (v.name === "Đặt khám theo chuyên khoa") feature = "booking.date";
      if (v.name === "Đặt khám theo bác sĩ") feature = "booking.doctor";
      if (v.name === "Tiêm chủng") feature = "booking.vaccine";
      if (v.name === "Gói khám sức khỏe") feature = "booking.package";
    });
    query.append("feature", feature);
    query.append("hospitalId", hospital._id as string);
    query.append("stepName", "subject");
    return "/chon-lich-kham?" + query.toString();
  };
  return (
    <div className="bg-[#e8f2f7]">
      <div>
        <div className={styles.breadcrumbContainer}>
          <Breadcrumb className={styles.breadcrumbs}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className={styles.breadcrumbLink}>
                  Trang chủ
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className={styles.breadcrumbLink}>
                  {hospital?.name ?? ""}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className={clsx(styles.breadcrumbLink, styles.activeLink)}
                >
                  Hình thức đặt khám
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="booking-container">
        <div className={styles.bookingContent}>
          <h1 className={styles.bookingTitle}>Các hình thức đặt khám</h1>
          <span className={styles.bookingDesc}>
            Đặt khám nhanh chóng, không phải chờ đợi với nhiều cơ sở y tế trên
            khắp các tỉnh thành
          </span>
          <div className={styles.bookingList}>
            {hospital?.booking_forms?.map((v) => (
              <Link
                href={generateQueryString()}
                key={v.id}
                className={styles.bookingLink}
              >
                <div className={styles.image}>
                  <Image
                    src={v?.image ?? ""}
                    alt={v?.name ?? ""}
                    width={200}
                    height={200}
                  />
                </div>
                <span className="font-semibold">{v.name}</span>
              </Link>
            ))}
          </div>
          <div className="text-left p-3">
            <Button variant={"ghost"}>
              <ResetIcon className="mr-2 w-4 h-4" />
              <Link href="/co-so-y-te">Quay lại</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
