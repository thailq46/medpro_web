"use client";
import apiDoctor from "@/apiRequest/ApiDoctor";
import apiService from "@/apiRequest/ApiService";
import {LIMIT, LIST_POSITION_DOCTOR, PAGE} from "@/apiRequest/common";
import {LocationIcon} from "@/components/Icon";
import PaginationSection from "@/components/PaginationSection";
import {Button} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Skeleton} from "@/components/ui/skeleton";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import {getStepNameAndServiceId, renderPosition} from "@/lib/utils";
import {MagnifyingGlassIcon} from "@radix-ui/react-icons";
import {useQuery} from "@tanstack/react-query";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useState} from "react";
import styles from "./DoctorBooking.module.scss";

const useServiceData = (hospitalId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.GET_SERVICE_BY_HOSPITAL_ID, hospitalId],
    queryFn: () => apiService.getFullServiceByHospitalId(hospitalId),
    enabled: !!hospitalId,
  });
};

export default function DoctorBooking() {
  const [currentPage, setCurrentPage] = useState<number>(PAGE);
  const [itemsPerPage, _] = useState<number>(LIMIT);
  const [search, setSearch] = useState<string>("");
  const [position, setPosition] = useState<string | undefined>(undefined);
  const [hospitalId, setHospitalId] = useState<string>("");

  const router = useRouter();

  const {data: doctors, isLoading} = useQuery({
    queryKey: [
      QUERY_KEY.GET_LIST_DOCTOR,
      {page: currentPage, limit: itemsPerPage, search, position},
    ],
    queryFn: () =>
      apiDoctor.getListDoctor({
        page: currentPage,
        limit: itemsPerPage,
        search,
        position,
      }),
  });

  const {data: services} = useServiceData(hospitalId);

  return (
    <>
      <div className={styles.bannerWrapper}>
        <div className={styles.bannerContainer}>
          <div className={styles.card}>
            <h1 className={styles.title}>Đặt khám theo bác sĩ</h1>
            <span className={styles.desc}>
              Chủ động chọn bác sĩ mà bạn tin tưởng, an tâm khám bệnh
            </span>
          </div>
          <div className={styles.bannerImage}>
            <Image
              src="/img/doctor-booking.png"
              alt="Banner"
              width={1000}
              height={1000}
              className="w-full h-full object-contains"
            />
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.container}>
          <div className={styles.search}>
            <MagnifyingGlassIcon className="w-5 h-5" />
            <input
              type="search"
              placeholder="Tìm kiếm bác sĩ"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              onValueChange={(e) => {
                if (e === "null") {
                  setPosition(undefined);
                }
                setPosition(e);
              }}
            >
              <SelectTrigger className="w-[180px] border-none outline-none  focus:ring-transparent">
                <SelectValue placeholder="Tìm kiếm chức vụ" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="null">Tìm kiếm chức vụ</SelectItem>
                  {LIST_POSITION_DOCTOR.map((value) => (
                    <SelectItem
                      value={value.value.toString()}
                      key={value.value}
                    >
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className={styles.listDoctor}>
            <div className={styles.left}>
              {!isLoading
                ? doctors?.payload?.data.map((doctor) => (
                    <div
                      className={`rounded-2xl w-full border-2 hover:border-[#00b5f1] transition-all overflow-hidden`}
                      key={doctor._id}
                    >
                      <div className="p-3 bg-white flex items-start gap-5">
                        <div className="w-[120px] h-[120px]">
                          <Image
                            src={doctor?.avatar || "/img/avatar/avatar.jpg"}
                            alt="Avatar"
                            width={120}
                            height={120}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                        <div>
                          <h3 className="text-[#11a2f3] text-xl">
                            {renderPosition(doctor?.position!)}{" "}
                            <span className="font-bold">
                              {doctor?.name} | {doctor.specialty?.name}
                            </span>
                          </h3>
                          <div>
                            <strong>Chuyên trị: </strong>
                            {doctor?.therapy}
                          </div>
                          <div>
                            <strong>Lịch khám: </strong>
                            {doctor?.session}
                          </div>
                          <div>
                            <strong>Giá khám: </strong>
                            {doctor?.price?.toLocaleString("vi-VN")}đ
                          </div>
                        </div>
                      </div>
                      <div className={styles.frame}>
                        <div className="flex gap-2 items-start">
                          <LocationIcon className="w-3 h-3" />
                          <div className={styles.groupAddress}>
                            <div className={styles.hospitalName}>
                              {doctor?.specialty?.hospital?.name}
                            </div>
                            <p className={styles.address}>
                              {doctor?.specialty?.hospital?.address}
                            </p>
                          </div>
                        </div>
                        <Button
                          className={styles.btn}
                          onClick={() => {
                            setHospitalId(doctor?.hospital_id as string);
                            const params = new URLSearchParams();
                            if (services) {
                              const {stepName, serviceId} =
                                getStepNameAndServiceId({
                                  specialty_id: doctor?.specialty?._id || "",
                                  services: services?.payload?.data || [],
                                });
                              params.append("feature", "booking.doctor");
                              params.append(
                                "hospitalId",
                                doctor?.hospital_id || ""
                              );
                              params.append(
                                "specialtyId",
                                doctor?.specialty?._id || ""
                              );
                              params.append(
                                "doctorId",
                                doctor?.doctor_id || ""
                              );
                              params.append("stepName", stepName);
                              params.append("serviceId", serviceId || "");
                              router.push(
                                `/chon-lich-kham?${params.toString()}`
                              );
                              router.refresh();
                            }
                          }}
                        >
                          Đặt ngay
                        </Button>
                      </div>
                    </div>
                  ))
                : Array.from({length: 3}).map((_, index) => (
                    <div
                      className="rounded-2xl w-full overflow-hidden"
                      key={index}
                    >
                      <div className="p-3 bg-white flex items-start gap-5">
                        <Skeleton className="w-[120px] h-[120px] rounded-lg flex-shrink-0" />
                        <div className="flex flex-col gap-2 w-full">
                          <Skeleton className="w-full h-6 rounded-lg" />
                          <Skeleton className="w-full h-5 rounded-lg" />
                          <Skeleton className="w-full h-5 rounded-lg" />
                        </div>
                      </div>
                      <div className={styles.frame}>
                        <div className="w-full">
                          <Skeleton className="w-full h-5 rounded-lg" />
                          <Skeleton className="w-full h-5 rounded-lg mt-2" />
                        </div>
                        <div className="w-[150px]">
                          <Skeleton className="w-full h-10 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
            {!!doctors?.payload?.data?.length && (
              <div className={styles.right}>
                {isLoading ? (
                  <Skeleton className="w-full h-[500px] rounded-lg" />
                ) : (
                  <Image
                    src="/img/salebooking.png"
                    alt="Banner"
                    width={1000}
                    height={1000}
                    className="w-full object-contain"
                  />
                )}
              </div>
            )}
          </div>
          {!doctors?.payload?.data?.length && !isLoading && (
            <div className={styles.emptyList}>
              <p>Không tìm thấy dữ liệu cần tìm</p>
              <div className="w-[300px] h-[300px]">
                <Image
                  src="/img/EmptyList.png"
                  width={300}
                  height={300}
                  alt="empty-list"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
        {!!doctors?.payload?.data?.length && (
          <div className="pb-4">
            <PaginationSection
              currentPage={doctors?.payload?.meta?.current_page as number}
              totalPages={doctors?.payload?.meta?.total_page as number}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </>
  );
}
