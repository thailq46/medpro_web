"use client";
import {IDoctorBody} from "@/apiRequest/ApiDoctor";
import apiSchedule from "@/apiRequest/ApiSchedule";
import {IServiceBody} from "@/apiRequest/ApiService";
import {
  BOOKING,
  PARAMS,
  QUERY_PARAMS,
  RoleType,
  STEP_NAME,
  VerifyStatus,
} from "@/apiRequest/common";
import {AppContext} from "@/app/(home)/AppProvider";
import {ModalConfirmCustom} from "@/components/ModalComfirm";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import sortTimes, {addAmPmSuffix} from "@/lib/SortTimesHelper";
import {useQuery} from "@tanstack/react-query";
import {vi} from "date-fns/locale";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useContext, useEffect, useState} from "react";
import {DayPicker} from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./BookingAppointment.module.scss";
const ModalBookingAppointment = dynamic(
  () => import("@/module/booking-appointment/modal-booking"),
  {ssr: false}
);

interface IChooseDateProps {
  onChooseDate: (date: string) => void;
  doctors?: IDoctorBody[];
  services?: IServiceBody;
}

export default function ChooseDate({
  onChooseDate,
  doctors,
  services,
}: IChooseDateProps) {
  const [selected, setSelected] = useState<Date>();
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [isModalBookingOpen, setIsModalBookingOpen] = useState(false);
  const [timeAppointment, setTimeAppointment] = useState<string>("");

  const {user} = useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const doctorId = searchParams.get(PARAMS.DOCTOR_ID);
  const feature = searchParams.get(PARAMS.FEATURE);

  const date = selected ? dayjs(selected).format("DD/MM/YYYY") : "";

  const doctorInfo = doctors?.find((doctor) => doctor.doctor_id === doctorId);

  const {data: schedule, isLoading} = useQuery({
    queryKey: [
      QUERY_KEY.GET_SCHEDULE_BY_DOCTOR_ID,
      {doctor_id: doctorId, params: {...QUERY_PARAMS, date}},
    ],
    queryFn: () =>
      apiSchedule.getListScheduleByDoctorId({
        doctor_id: doctorId ?? "",
        params: {...QUERY_PARAMS, date},
      }),
    enabled: !!doctorId,
  });

  useEffect(() => {
    if (selected) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(PARAMS.STEP_NAME, STEP_NAME.TIME);
      router.push(`${pathname}?${params.toString()}`, undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleChooseDate = (time: string) => {
    setTimeAppointment(time);
    if (!user || (user && user?.verify === VerifyStatus.UNVERIFIED)) {
      setIsModalConfirmOpen(true);
    } else {
      setIsModalBookingOpen(true);
    }
  };

  return (
    <>
      <ModalConfirmCustom
        isOpen={isModalConfirmOpen}
        setIsOpen={setIsModalConfirmOpen}
        title={
          user && user?.verify === VerifyStatus.UNVERIFIED
            ? "Chưa xác thực tài khoản"
            : "Chưa đăng nhập"
        }
        content={
          user && user?.verify === VerifyStatus.UNVERIFIED
            ? "Vui lòng xác thực tài khoản để có thể đặt lịch khám bệnh"
            : "Vui lòng đăng nhập để có thể đặt lịch khám bệnh"
        }
        handleOke={() => {
          if (!user) {
            router.push("/login");
          }
        }}
      />
      <ModalBookingAppointment
        isOpen={isModalBookingOpen}
        setIsOpen={setIsModalBookingOpen}
        doctor={doctorInfo}
        timeAppointment={timeAppointment}
        dateAppointment={date}
        service={services}
      />
      <div className="calender-container">
        {schedule ||
        feature === BOOKING.VACCINE ||
        feature === BOOKING.PACKAGE ? (
          <DayPicker
            mode="single"
            locale={vi}
            weekStartsOn={0}
            selected={selected}
            disabled={{before: new Date()}}
            onSelect={(e) => {
              const date = dayjs(e).format("DD/MM/YYYY");
              onChooseDate(date);
              setSelected(e);
              if (feature === BOOKING.VACCINE || feature === BOOKING.PACKAGE) {
                const timeWork = addAmPmSuffix(
                  services?.hospital?.start_time +
                    " - " +
                    services?.hospital?.end_time
                );
                handleChooseDate(timeWork);
              }
            }}
            styles={{
              head: {backgroundColor: "#f7f7f7"},
              month: {flex: 1},
              table: {
                width: "100%",
                maxWidth: "100%",
                marginTop: "10px",
                fontWeight: "bold",
              },
              day: {margin: "auto"},
              head_cell: {
                border: "1px solid #dfe3eb",
                padding: "20px",
                fontSize: "15px",
              },
              cell: {border: "1px solid #dfe3eb", padding: "15px"},
              months: {
                overflowX: "auto",
              },
            }}
            modifiersStyles={{
              selected: {
                borderRadius: "5px",
                color: "#fff",
                background: "linear-gradient(48deg, #00b5f1, #00e0ff)",
              },
              today: {
                color: "red",
                backgroundColor: "#f2f2f2",
                borderRadius: "5px",
              },
            }}
          />
        ) : (
          <DisplayNoSchedule />
        )}
        {searchParams.get(PARAMS.STEP_NAME) === STEP_NAME.TIME &&
          selected &&
          feature !== BOOKING.VACCINE &&
          feature !== BOOKING.PACKAGE && (
            <div className={styles.timeline}>
              {isLoading ? (
                <>
                  <Skeleton className="w-full h-10"></Skeleton>
                  <Skeleton className="w-full h-20 mt-2"></Skeleton>
                </>
              ) : (
                <>
                  <h3>Thời gian làm việc</h3>
                  {!!schedule?.payload.data.length ? (
                    renderTimeType({
                      timeType: schedule?.payload.data[0].time_type as string[],
                      onClick: handleChooseDate,
                      isPatient: user?.role === RoleType.User,
                    })
                  ) : (
                    <div className="font-semibold text-red-600">
                      Chưa cập nhật lịch làm việc
                    </div>
                  )}
                  <p className="mt-4 font-semibold text-[#d98634]">
                    Tất cả thời gian theo múi giờ Việt Nam GMT +7
                  </p>
                </>
              )}
            </div>
          )}
      </div>
    </>
  );
}

function renderTimeType({
  timeType,
  onClick,
  isPatient,
}: {
  timeType: string[];
  onClick: (time: string) => void;
  isPatient: boolean;
}): JSX.Element {
  const timeAfterSort = sortTimes(timeType);
  return (
    <div className="flex flex-wrap items-center gap-4 mt-3">
      {timeAfterSort.map((time, index) => {
        return (
          <Button
            role="button"
            disabled={!isPatient}
            onClick={() => onClick(time)}
            key={index}
            className="text-center bg-transparent border border-[#1da1f2] text-black p-3 font-semibold rounded-lg cursor-pointer hover:bg-gradient-to-r from-[#00b5f1] to-[#00e0ff] transition-all hover:text-white"
          >
            {time}
          </Button>
        );
      })}
    </div>
  );
}

function DisplayNoSchedule() {
  return (
    <div className="flex items-center justify-center h-32">
      <p className="text-red-600 text-2xl uppercase">
        Bác sĩ này hiện chưa có lịch làm việc
      </p>
    </div>
  );
}
