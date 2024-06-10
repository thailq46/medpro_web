"use client";
import apiService from "@/apiRequest/ApiService";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import {DisplaySkeleton} from "@/module/booking-appointment";
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";
import styles from "./BookingAppointment.module.scss";

interface IChooseServiceProps {
  hospitalId: string;
  specialtyId: string;
  feature: string;
  doctorId: string;
  hospitalName?: string;
}

function DialogDetail({name = ""}: {name: string}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Chi tiết</Button>
      </DialogTrigger>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader className={styles.dialogHeader}>
          <DialogTitle>Thông tin</DialogTitle>
        </DialogHeader>
        <div className={styles.dialogBody}>
          <div>
            <h3 className="text-lg">Quy trình khám bệnh tại {name}</h3>
            <h4>Bước 1: Tư vấn và xác định dịch vụ khám chữa bệnh</h4>
            <div>
              <ul>
                <li>
                  Lịch hẹn của khách hàng được sắp lịch để kết nối trực tuyến
                  với chuyên viên bệnh viện {name}
                </li>
                <li>
                  Khách hàng cập nhật hồ sơ bệnh án, các câu hỏi mong muốn trên
                  phiếu khám điện tử trong vòng 03 ngày
                </li>
                <li>
                  Dựa trên thông tin khách hàng cung cấp, các chuyên viên{" "}
                  {name + " "}
                  trao đổi trực tuyến (Video call) trên nền tảng Medpro nhằm tư
                  vấn các dịch vụ, gói khám phù hợp nhất.
                </li>
              </ul>
            </div>
            <h4>Bước 2: Đặt lịch khám chính thức tại {name}</h4>
            <div>
              <ul>
                <li>
                  Dựa trên thông tin tư vấn bước 02, khách hàng nhận được phiếu
                  khám điện tử từ Medpro bao gồm:
                </li>
                <ul>
                  <li>Các dịch vụ khám chữa bệnh</li>
                  <li>Tổng chi phí khám chữa bệnh</li>
                  <li>Thời gian dự kiến</li>
                </ul>
                <li>
                  Khách hàng lựa chọn thêm các dịch vụ hỗ trợ của bên thứ 3:
                </li>
                <ul>
                  <li>Dịch vụ đưa đón tại sân bay</li>
                  <li>Dịch vụ phiên dịch trong ngày khám</li>
                  <li>Dịch vụ lưu trú</li>
                  <li>Các dịch vụ khác (nếu có)</li>
                </ul>
                <li>Xác nhận và tạm ứng 1.000.000 đồng.</li>
              </ul>
              <div>
                <strong>🔵Phí khám chữa bệnh:</strong>
                Theo biểu giá chính thức của bệnh viện - Thanh toán tại bệnh
                viện
              </div>
              <div>
                <strong>🔵Phí dịch vụ:</strong>
                Theo biểu giá chính thức nhà cung cấp dịch vụ - Thanh toán tại{" "}
                {name}
              </div>
              <div>
                <strong>🔵Phí tạm ứng:</strong>
                Thanh toán trực tuyến tại Việt Nam để xác nhận và giữ lịch hẹn
                với bệnh viện/nhà cung cấp dịch vụ; phí này được hoàn trả sau
                khi khách hàng hoàn tất sử dụng dịch vụ
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ChooseService({
  hospitalId,
  specialtyId,
  feature,
  doctorId,
  hospitalName,
}: IChooseServiceProps) {
  const {data: services, isLoading} = useQuery({
    queryKey: [QUERY_KEY.GET_SERVICE_BY_HOSPITAL_ID, hospitalId],
    queryFn: () => apiService.getFullServiceByHospitalId(hospitalId),
    enabled: !!hospitalId,
  });

  const result = services?.payload?.data?.filter(
    (v) => v.specialty?._id === specialtyId
  );

  return (
    <>
      {isLoading ? (
        <DisplaySkeleton />
      ) : (
        <div className={styles.rightBody}>
          <div className={styles.listService}>
            <Table
              className={`text-base text-textPrimary ${styles.serviceTable}`}
            >
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead className="font-bold">Tên dịch vụ</TableHead>
                  <TableHead className="font-bold">Giá tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.map((service, index) => (
                  <TableRow key={service._id} className="cursor-pointer">
                    <TableCell className="font-medium">{index}</TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="font-bold">{service.name}</p>
                      <p className="font-medium italic">
                        Lịch khám: {service.session}
                      </p>
                      {service.description &&
                        service.description !== "null" && (
                          <p className="font-medium italic">
                            ({service.description})
                          </p>
                        )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {service.price?.toLocaleString("vi-VN")}đ
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DialogDetail name={hospitalName ?? ""} />
                      <Button className="ml-2">
                        <Link
                          href={{
                            pathname: "/chon-lich-kham",
                            query: {
                              feature,
                              hospitalId,
                              specialtyId,
                              stepName: "date",
                              doctorId,
                              serviceId: service._id,
                            },
                          }}
                        >
                          Đặt khám ngay
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* MOBILE/TABLET */}
            <div className={styles.mobile}>
              {result?.map((service) => (
                <div className={styles.mobileBox} key={service._id}>
                  <div className={styles.mobileItem}>
                    <p className={styles.mobileItemTitle}>Tên dịch vụ</p>
                    <p className={styles.mobileItemContent}>{service.name}</p>
                    {service.description && service.description !== "null" && (
                      <p className="font-medium italic">
                        ({service.description})
                      </p>
                    )}
                  </div>
                  <div className={styles.mobileItem}>
                    <p className={styles.mobileItemTitle}>Lịch khám</p>
                    <p className={styles.mobileItemContent}>
                      {service.session}
                    </p>
                  </div>
                  <div className={styles.mobileItem}>
                    <p className={styles.mobileItemTitle}>Giá tiền</p>
                    <p className={styles.mobileItemContent}>
                      {service.price?.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <DialogDetail name={hospitalName ?? ""} />
                    <Button>
                      <Link
                        href={{
                          pathname: "/chon-lich-kham",
                          query: {
                            feature,
                            hospitalId,
                            specialtyId,
                            stepName: "date",
                            doctorId,
                            serviceId: service._id,
                          },
                        }}
                      >
                        Đặt khám ngay
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
