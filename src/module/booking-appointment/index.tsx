"use client";
import apiDoctor from "@/apiRequest/ApiDoctor";
import apiHospital from "@/apiRequest/ApiHospital";
import apiSpecialty from "@/apiRequest/ApiSpecialty";
import {
  HospitalIcon,
  StethoscopeIcon,
  SuitcaseMedicalIcon,
} from "@/components/Icon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import ChooseDate from "@/module/booking-appointment/choose-date";
import ChooseDoctor from "@/module/booking-appointment/choose-doctor";
import ChooseService from "@/module/booking-appointment/choose-service";
import ChooseSubject from "@/module/booking-appointment/choose-subject";
import {useQuery} from "@tanstack/react-query";
import clsx from "clsx";
import {useSearchParams} from "next/navigation";
import styles from "./BookingAppointment.module.scss";

export default function BookingAppointment() {
  const searchParams = useSearchParams();

  const feature = searchParams.get("feature");
  const hospitalId = searchParams.get("hospitalId");
  const stepName = searchParams.get("stepName");
  const specialtyId = searchParams.get("specialtyId");
  const doctorId = searchParams.get("doctorId");
  const serviceId = searchParams.get("serviceId");

  const {data: hospital} = useQuery({
    queryKey: [QUERY_KEY.GET_HOSPITAL_BY_ID, hospitalId],
    queryFn: () => apiHospital.getHospitalById(hospitalId ?? ""),
    enabled: !!hospitalId,
  });
  const {data: specialty} = useQuery({
    queryKey: [QUERY_KEY.GET_SPECIALTY_BY_HOSPITAL_ID, hospitalId],
    queryFn: () => apiSpecialty.getListSpecialtyByHospitalId(hospitalId ?? ""),
    enabled: !!hospitalId,
  });
  const {data: doctor} = useQuery({
    queryKey: [
      QUERY_KEY.GET_DOCTOR_BY_SPECIALTY_ID,
      {hospital_id: hospitalId, specialty_id: specialtyId},
    ],
    queryFn: () =>
      apiDoctor.getListDoctorBySpecialtyId({
        hospital_id: hospitalId ?? "",
        specialty_id: specialtyId ?? "",
      }),
    enabled: !!hospitalId && !!specialtyId,
  });
  const generateBookingName = () => {
    if (stepName === "subject") return "Chọn chuyên khoa";
    if (stepName === "doctor") return "Chọn bác sĩ";
    if (stepName === "service") return "Chọn dịch vụ";
    return "";
  };
  return (
    <div className="bg-[#e8f2f7]">
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
                {hospital?.payload?.data?.name ?? ""}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className={clsx(styles.breadcrumbLink, styles.activeLink)}
              >
                {generateBookingName()}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className="booking-appointment_left">
            <div className={styles.leftContent}>
              <div className={styles.leftHeader}>
                <h3>Thông tin cơ sở y tế</h3>
              </div>
              <div className={styles.leftBody}>
                <ul>
                  <li>
                    <HospitalIcon className="w-5 h-5 flex-shrink-0" />
                    <div className={styles.hospitalInfo}>
                      <span>{hospital?.payload?.data?.name ?? ""}</span>
                      <p className={styles.address}>
                        {hospital?.payload?.data?.address ?? ""}
                      </p>
                    </div>
                  </li>
                  {specialtyId && (
                    <li>
                      <SuitcaseMedicalIcon className="w-5 h-5 flex-shrink-0" />
                      <div className={styles.hospitalInfo}>
                        <span>
                          Chuyên khoa:{" "}
                          {specialty?.payload?.data.find(
                            (v) => v._id === specialtyId
                          )?.name ?? ""}
                        </span>
                      </div>
                    </li>
                  )}
                  {doctorId && (
                    <li>
                      <StethoscopeIcon className="w-5 h-5 flex-shrink-0" />
                      <div className={styles.hospitalInfo}>
                        <span>
                          Bác sĩ:{" "}
                          {
                            doctor?.payload?.data.find(
                              (v) => v.doctor_id === doctorId
                            )?.name
                          }
                        </span>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="booking-appointment_right">
            <div className={styles.rightContent}>
              <div className={styles.rightHeader}>
                <h3>
                  {stepName === "subject"
                    ? "Vui lòng chọn chuyên khoa"
                    : stepName === "doctor"
                    ? "Vui lòng chọn bác sĩ"
                    : "Vui lòng chọn dịch vụ"}
                </h3>
              </div>
              {stepName === "subject" && (
                <ChooseSubject
                  feature={feature ?? ""}
                  hospitalId={hospitalId ?? ""}
                  stepName={stepName}
                  specialty={specialty?.payload?.data ?? []}
                />
              )}
              {stepName === "doctor" && (
                <ChooseDoctor
                  feature={feature ?? ""}
                  hospitalId={hospitalId ?? ""}
                  specialtyId={specialtyId ?? ""}
                  doctors={doctor?.payload?.data ?? []}
                />
              )}
              {stepName === "date" && <ChooseDate />}
              {stepName === "service" && <ChooseService />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
