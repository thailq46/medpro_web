"use client";
import apiAppointment from "@/apiRequest/ApiAppointment";
import apiHospital from "@/apiRequest/ApiHospital";
import apiPayment from "@/apiRequest/ApiPayment";
import {handleErrorApi} from "@/apiRequest/ErrorMessage/errors";
import {QUERY_PARAMS} from "@/apiRequest/common";
import {AppContext} from "@/app/(home)/AppProvider";
import {SpinnerIcon} from "@/components/Icon";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import {renderPosition} from "@/lib/utils";
import {CheckCircledIcon, CrossCircledIcon} from "@radix-ui/react-icons";
import {useQuery} from "@tanstack/react-query";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useContext, useState} from "react";
import index from "./Account.module.scss";

export default function AppointmentForm() {
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

  const {user} = useContext(AppContext);
  const router = useRouter();

  const {data: appointment} = useQuery({
    queryKey: [QUERY_KEY.GET_APPOINTMENT_BY_PATIENT_ID, user?._id],
    queryFn: () => apiAppointment.getByPatientId(user?._id ?? ""),
    enabled: !!user?._id,
  });

  const {data: hospital} = useQuery({
    queryKey: [QUERY_KEY.GET_LIST_HOSPITALS],
    queryFn: () => apiHospital.getListHospital(QUERY_PARAMS),
  });

  const handlePayment = async (id: string, price: number) => {
    if (loading[id]) return;
    setLoading((prev) => ({...prev, [id]: true}));
    try {
      const result = await apiPayment.payment(price);
      if (result.payload.resultCode === 0) {
        router.push(result.payload.payUrl);
        await apiAppointment.updateOrderId({
          id,
          order_id: result.payload.orderId,
        });
      }
    } catch (error) {
      handleErrorApi({error});
    } finally {
      setLoading((prev) => ({...prev, [id]: false}));
    }
  };
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="border-b border-gray-300 pb-4">
          Lịch khám của bạn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[450px] h-full overflow-y-scroll">
        {appointment && !!appointment.payload.data.length ? (
          <>
            <Table className={index.table}>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Thông tin bác sĩ</TableHead>
                  <TableHead className="w-[150px]">Ngày khám</TableHead>
                  <TableHead className="text-center w-[90px]">
                    Trạng thái
                  </TableHead>
                  <TableHead className="text-center w-[100px]">
                    Thanh toán
                  </TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointment?.payload?.data.map((value) => {
                  const hospitalName = hospital?.payload?.data.find((h) => {
                    if (value.doctor_id !== null) {
                      return h._id === value.doctor?.hospital_id;
                    }
                    return h._id === value.service?.hospital_id;
                  })?.name;
                  return (
                    <TableRow key={value._id}>
                      <TableCell className="font-medium">
                        <p>{hospitalName}</p>
                        <p>
                          {renderPosition(value.doctor?.position as number)}{" "}
                          {value.doctor?.name || "Bác sĩ thuộc bệnh viện"}
                        </p>
                      </TableCell>
                      <TableCell className="font-medium">
                        <p>{value.date}</p>
                        <p>{value.time}</p>
                        <p>{value.service?.name}</p>
                        <p>$ {value.price?.toLocaleString("vi-VN")}đ</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {value.status === true ? (
                            <CheckCircledIcon className="text-green-600 w-5 h-5" />
                          ) : (
                            <CrossCircledIcon className="text-red-600 w-5 h-5" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {value.isPayment === true ? (
                            <CheckCircledIcon className="text-green-600 w-5 h-5" />
                          ) : (
                            <CrossCircledIcon className="text-red-600 w-5 h-5" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end items-center">
                          <Button
                            size="sm"
                            disabled={
                              loading[value._id!] || value.isPayment === true
                            }
                            onClick={() =>
                              handlePayment(value?._id!, value.price!)
                            }
                          >
                            {value.isPayment === false &&
                              loading[value._id!] && (
                                <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                              )}
                            {value.isPayment === true
                              ? "Đã thanh toán"
                              : "Thanh toán"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {/* TABLET */}
            <div className={index.appointmentTablet}>
              {appointment?.payload?.data.map((value) => {
                const hospitalName = hospital?.payload?.data.find(
                  (h) => h._id === value.doctor?.hospital_id
                )?.name;
                return (
                  <div className={index.appointmentBox} key={value._id}>
                    <div className={index.appointmentBoxItem}>
                      <div className="w-[80px] h-[80px]">
                        <Image
                          src={
                            value?.doctor?.avatar || "/img/avatar/avatar.jpg"
                          }
                          alt="avatar"
                          width={80}
                          height={80}
                          className="rounded-full w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-sm font-medium">
                        <p className="font-bold">
                          {renderPosition(value.doctor?.position as number) +
                            " " +
                            value.doctor?.name}{" "}
                          - {hospitalName}
                        </p>
                        <p>
                          {value.date} - {value.time}
                        </p>
                        <p>
                          $ {value.price?.toLocaleString("vi-VN")}đ -{" "}
                          {value.service?.name}
                        </p>
                        <p>
                          Trạng thái:{" "}
                          {value.status === true
                            ? "Đã duyệt lịch khám"
                            : "Chưa duyệt lịch khám"}
                        </p>
                      </div>
                    </div>
                    <div className="w-full mt-3">
                      <Button
                        className="w-full"
                        disabled={
                          loading[value._id!] || value.isPayment === true
                        }
                        onClick={() => handlePayment(value?._id!, value.price!)}
                      >
                        {value.isPayment === false && loading[value._id!] && (
                          <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {value.isPayment === true
                          ? "Đã thanh toán"
                          : "Thanh toán"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div>Lịch khám đang trống</div>
        )}
      </CardContent>
    </Card>
  );
}
