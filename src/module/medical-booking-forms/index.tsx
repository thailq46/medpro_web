"use client";
import {IGetHospitalRes} from "@/apiRequest/ApiHospital";
import {BOOKING, CATE, PARAMS, STEP_NAME} from "@/apiRequest/common";
import Custom500 from "@/components/Layout/ErrorLayout/500";
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
import styles from "./Booking.module.scss";

export default function MedicalBookingForms({
  hospital,
}: {
  hospital: IGetHospitalRes["data"];
}) {
  if (!hospital) return <Custom500 />;
  const generateQueryString = (name: string) => {
    const query = new URLSearchParams();
    let feature = "";
    let stepName = "";
    switch (name.trim()) {
      case "Đặt khám theo chuyên khoa":
        feature = BOOKING.DATE;
        stepName = STEP_NAME.SUBJECT;
        break;
      case "Đặt khám theo bác sĩ":
        feature = BOOKING.DOCTOR;
        stepName = STEP_NAME.DOCTOR;
        break;
      case "Tiêm chủng":
        feature = BOOKING.VACCINE;
        stepName = STEP_NAME.SERVICE;
        break;
      case "Gói khám sức khoẻ":
        feature = BOOKING.PACKAGE;
        stepName = STEP_NAME.SERVICE;
        break;
      default:
        feature = "";
        break;
    }
    query.append(PARAMS.FEATURE, feature);
    query.append(PARAMS.HOSPITAL_ID, hospital._id as string);
    query.append(PARAMS.STEP_NAME, stepName);
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
                href={generateQueryString(v.name ?? "")}
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
              <Link href={`/${CATE.CSYT}`}>Quay lại</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
