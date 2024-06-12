"use client";
import {VerifyIcon} from "@/components/Icon";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function VerifyLayout({isError}: {isError: boolean}) {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col items-center justify-center pb-10">
      {isError ? (
        <>
          <div className="mt-16 text-red-600">
            <VerifyIcon className="w-32 h-32" />
          </div>
          <h1 className="text-3xl font-bold mt-3 text-red-600">
            Verification Unsuccessful
          </h1>
          <p className="mt-3 font-medium">
            Bạn đã xác thực tài khoản thất bại. Vui lòng thử lại....
          </p>
        </>
      ) : (
        <>
          <div className="mt-16 text-[#6BC839]">
            <VerifyIcon className="w-32 h-32" />
          </div>
          <h1 className="text-3xl font-bold mt-3">Verification Successful</h1>
          <p className="mt-3 font-medium">
            Bạn đã xác thực tài khoản thành công. Bây giờ bạn có thể đặt lịch
            khám bệnh với bác sĩ ngay bây giờ...
          </p>
        </>
      )}
      <Button
        className="mt-4"
        onClick={() => {
          router.refresh();
          router.push("/");
        }}
      >
        Trang chủ
      </Button>
    </div>
  );
}
