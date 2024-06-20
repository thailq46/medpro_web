"use client";
import apiDoctor from "@/apiRequest/ApiDoctor";
import apiHospital from "@/apiRequest/ApiHospital";
import apiService, {IServiceBody} from "@/apiRequest/ApiService";
import apiSpecialty from "@/apiRequest/ApiSpecialty";
import {
  HandHoldingMedicalIcon,
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
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import ChooseDate from "@/module/booking-appointment/choose-date";
import ChooseDoctor, {
  DoctorFilter,
} from "@/module/booking-appointment/choose-doctor";
import ChooseService from "@/module/booking-appointment/choose-service";
import ChooseSubject from "@/module/booking-appointment/choose-subject";
import {CalendarIcon, ResetIcon} from "@radix-ui/react-icons";
import {useQuery} from "@tanstack/react-query";
import clsx from "clsx";
import {useRouter, useSearchParams} from "next/navigation";
import {useCallback, useState} from "react";
import styles from "./BookingAppointment.module.scss";

export default function BookingAppointment() {
  const [dateSelected, setDateSelected] = useState<string>("");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("");
  const [filterDoctor, setFilterDoctor] = useState<DoctorFilter>({
    name: "",
    gender: "",
    position: "",
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const feature = searchParams.get("feature");
  const hospitalId = searchParams.get("hospitalId");
  const stepName = searchParams.get("stepName");
  const specialtyId = searchParams.get("specialtyId");
  const doctorId = searchParams.get("doctorId");
  const serviceId = searchParams.get("serviceId");

  const {data: hospital, isLoading: isLoadingHospital} = useQuery({
    queryKey: [QUERY_KEY.GET_HOSPITAL_BY_ID, hospitalId],
    queryFn: () => apiHospital.getHospitalById(hospitalId ?? ""),
    enabled: !!hospitalId,
  });

  const {data: specialty, isLoading: isLoadingSpecialty} = useQuery({
    queryKey: [
      QUERY_KEY.GET_SPECIALTY_BY_HOSPITAL_ID,
      {hospitalId: hospitalId, params: {search: filterSpecialty}},
    ],
    queryFn: () =>
      apiSpecialty.getListSpecialtyByHospitalId({
        hospitalId: hospitalId ?? "",
        params: {search: filterSpecialty},
      }),
    enabled: !!hospitalId,
  });

  const {data: doctor, isLoading: isLoadingDoctor} = useQuery({
    queryKey: [
      QUERY_KEY.GET_DOCTOR_BY_SPECIALTY_ID,
      {
        hospital_id: hospitalId,
        specialty_id: specialtyId,
        search: filterDoctor.name,
        gender: filterDoctor.gender,
        position: filterDoctor.position,
      },
    ],
    queryFn: () =>
      apiDoctor.getListDoctorBySpecialtyId({
        hospital_id: hospitalId ?? "",
        specialty_id: specialtyId ?? "",
        search: filterDoctor.name,
        gender: filterDoctor.gender,
        position: filterDoctor.position,
      }),
    enabled: !!hospitalId && !!specialtyId,
  });

  const {data: service} = useQuery({
    queryKey: [QUERY_KEY.GET_SERVICE_BY_ID, serviceId],
    queryFn: () => apiService.getServiceById(serviceId ?? ""),
    enabled: !!serviceId,
  });

  const generateBookingName = () => {
    switch (stepName) {
      case "subject":
        return "Chọn chuyên khoa";
      case "doctor":
        return "Chọn bác sĩ";
      case "service":
        return "Chọn dịch vụ";
      case "date":
      case "time":
        return "Chọn ngày tư vấn";
      default:
        return "";
    }
  };
  const generateBookingTitle = () => {
    switch (stepName) {
      case "subject":
        return "Vui lòng chọn chuyên khoa";
      case "doctor":
        return "Vui lòng chọn bác sĩ";
      case "service":
        return "Vui lòng chọn dịch vụ";
      case "date":
      case "time":
        return "Vui lòng chọn ngày tư vấn";
      default:
        return "";
    }
  };

  const renderRightContent = useCallback(() => {
    switch (stepName) {
      case "subject":
        return (
          <ChooseSubject
            feature={feature ?? ""}
            hospitalId={hospitalId ?? ""}
            stepName={stepName}
            specialty={specialty?.payload?.data ?? []}
            isLoading={isLoadingSpecialty}
            onSearchSpecialty={(value) => setFilterSpecialty(value)}
          />
        );
      case "doctor":
        return (
          <ChooseDoctor
            feature={feature ?? ""}
            hospitalId={hospitalId ?? ""}
            specialtyId={specialtyId ?? ""}
            isLoading={isLoadingDoctor}
            doctors={doctor?.payload?.data ?? []}
            specialty={specialty?.payload?.data ?? []}
            onFilterDoctor={(value) => setFilterDoctor(value)}
          />
        );
      case "date":
      case "time":
        return (
          <ChooseDate
            onChooseDate={(date) => setDateSelected(date)}
            doctors={doctor?.payload?.data ?? []}
            services={(service?.payload?.data as IServiceBody) ?? []}
          />
        );
      case "service":
        return (
          <ChooseService
            feature={feature ?? ""}
            hospitalId={hospitalId ?? ""}
            specialtyId={specialtyId ?? ""}
            doctorId={doctorId ?? ""}
            hospitalName={hospital?.payload?.data?.name ?? ""}
          />
        );
      default:
        return null;
    }
  }, [
    stepName,
    feature,
    hospitalId,
    specialty?.payload?.data,
    isLoadingSpecialty,
    specialtyId,
    isLoadingDoctor,
    doctor?.payload?.data,
    service?.payload?.data,
    doctorId,
    hospital?.payload?.data?.name,
  ]);

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
                {isLoadingHospital ? (
                  <div className="flex items-start gap-2">
                    <Skeleton className="w-5 h-5" />
                    <Skeleton className="w-full h-10" />
                  </div>
                ) : (
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
                    {serviceId && (
                      <li>
                        <HandHoldingMedicalIcon className="w-5 h-5 flex-shrink-0" />
                        <div className={styles.hospitalInfo}>
                          <span>Dịch vụ: {service?.payload?.data?.name}</span>
                        </div>
                      </li>
                    )}
                    {dateSelected && (
                      <li>
                        <CalendarIcon className="w-5 h-5 flex-shrink-0" />
                        <div className={styles.hospitalInfo}>
                          <span>Ngày khám: {dateSelected}</span>
                        </div>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="booking-appointment_right">
            <div className={styles.rightContent}>
              <div className={styles.rightHeader}>
                <h3>{generateBookingTitle()}</h3>
              </div>
              {renderRightContent()}
            </div>
            <div className="mt-3">
              <Button variant={"ghost"} onClick={() => router.back()}>
                Quay lại
                <ResetIcon className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DisplaySkeleton() {
  return (
    <div className={styles.rightBody}>
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-[25%] h-10 mt-10" />
      <Skeleton className="w-full h-10 mt-1" />
      <Skeleton className="w-full h-10 mt-1" />
      <Skeleton className="w-full h-10 mt-1" />
    </div>
  );
}
