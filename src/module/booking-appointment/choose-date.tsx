"use client";
import apiSchedule from "@/apiRequest/ApiSchedule";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import sortTimes from "@/lib/SortTimesHelper";
import {useQuery} from "@tanstack/react-query";
import {vi} from "date-fns/locale";
import dayjs from "dayjs";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {DayPicker} from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./BookingAppointment.module.scss";

export default function ChooseDate({
  onChooseDate,
}: {
  onChooseDate: (date: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<Date>();
  const doctorId = searchParams.get("doctorId");
  const date = selected ? dayjs(selected).format("DD/MM/YYYY") : "";
  const {data: schedule} = useQuery({
    queryKey: [
      QUERY_KEY.GET_SCHEDULE_BY_DOCTOR_ID,
      {doctor_id: doctorId, params: {limit: 99, page: 1, date}},
    ],
    queryFn: () =>
      apiSchedule.getListScheduleByDoctorId({
        doctor_id: doctorId ?? "",
        params: {limit: 99, page: 1, date},
      }),
    enabled: !!doctorId,
  });

  useEffect(() => {
    if (selected) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("stepName", "time");
      router.push(`${pathname}?${params.toString()}`, undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <>
      <div className="calender-container">
        {schedule ? (
          <DayPicker
            mode="single"
            locale={vi}
            weekStartsOn={0}
            selected={selected}
            disabled={{
              before: new Date(),
            }}
            onSelect={(e) => {
              const date = dayjs(e).format("DD/MM/YYYY");
              onChooseDate(date);
              setSelected(e);
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
        {searchParams.get("stepName") === "time" && selected && (
          <div className={styles.timeline}>
            <h3>Thời gian làm việc</h3>
            {!!schedule?.payload.data.length ? (
              renderTimeType(schedule?.payload.data[0].time_type as string[])
            ) : (
              <div className="font-semibold text-red-600">
                Chưa cập nhập lịch làm việc
              </div>
            )}
            <p className="mt-4 font-semibold text-[#d98634]">
              Tất cả thời gian theo múi giờ Việt Nam GMT +7
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function renderTimeType(timeType: string[]): JSX.Element {
  const timeAfterSort = sortTimes(timeType);
  return (
    <div className="flex flex-wrap items-center gap-4 mt-3">
      {timeAfterSort.map((time, index) => {
        return (
          <div
            key={index}
            className="text-center border border-[#1da1f2] text-black p-3 font-semibold rounded-lg cursor-pointer hover:bg-gradient-to-r from-[#00b5f1] to-[#00e0ff] transition-all hover:text-white"
          >
            {time}
          </div>
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
