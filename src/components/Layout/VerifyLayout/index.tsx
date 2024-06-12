"use client";
import {VerifyIcon} from "@/components/Icon";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useRouter} from "next/navigation";

interface IVerifyProps {
  isError: boolean;
  title?: string;
  description?: string;
  isForgotPassword?: boolean;
  token?: string;
}

export default function VerifyLayout({
  isError,
  title,
  description,
  isForgotPassword = false,
  token = "",
}: IVerifyProps) {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col items-center justify-center pb-10">
      {isError ? (
        <>
          <div className="mt-16 text-red-600">
            <VerifyIcon className="w-32 h-32" />
          </div>
          <h1 className="text-3xl font-bold mt-3 text-red-600">
            {title ? title : "Verification Failed"}
          </h1>
          <p className="mt-3 font-medium">
            {description
              ? description
              : "Bạn đã xác thực tài khoản thất bại. Vui lòng thử lại...."}
          </p>
        </>
      ) : (
        <>
          <div className="mt-16 text-[#6BC839]">
            <VerifyIcon className="w-32 h-32" />
          </div>
          <h1 className="text-3xl font-bold mt-3">
            {title ? title : "Verification Successful"}
          </h1>
          <p className="mt-3 font-medium">
            {description
              ? description
              : "Bạn đã xác thực tài khoản thành công. Bây giờ bạn có thể đặt lịch khám bệnh với bác sĩ ngay bây giờ..."}
          </p>
        </>
      )}
      {!isForgotPassword ? (
        <Button
          className="mt-4"
          onClick={() => {
            router.refresh();
            router.push("/");
          }}
        >
          Trang chủ
        </Button>
      ) : (
        <Button className="mt-4" asChild>
          <Link href={{pathname: "/reset-password", query: {token}}}>
            Cập nhập mật khẩu mới
          </Link>
        </Button>
      )}
    </div>
  );
}
