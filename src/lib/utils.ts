import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const numberEnumToArray = (numberEnum: {
  [key: string]: string | number;
}) => {
  return Object.values(numberEnum).filter(
    (value) => typeof value === "number"
  ) as number[];
};

export function toBase64(file: File) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

export function generateDescription(slug: string): string {
  let desc = "";
  switch (slug) {
    case "benh-vien-cong":
      desc =
        "Đặt khám dễ dàng, không lo chờ đợi tại các bệnh viện công hàng đầu Việt Nam";
      break;
    case "benh-vien-tu":
      desc = "Tận hưởng dịch vụ y tế tư nhân, chăm sóc sức khỏe chuyên nghiệp";
      break;
    case "phong-kham":
      desc =
        "Trải nghiệm chăm sóc y tế tập trung và gần gũi tại phòng khám chuyên khoa";
      break;
    case "phong-mach":
      desc =
        "Chẩn đoán và điều trị chất lượng với bác sĩ chuyên khoa được nhiều người tin tưởng";
      break;
    case "xet-nghiem":
      desc =
        "Xét nghiệm chính xác, nhanh chóng và hỗ trợ chẩn đoán hiệu quả với các cơ sở uy tín hàng đầu";
      break;
    case "y-te-tai-nha":
      desc = "Chăm sóc sức khỏe tiện lợi và thoải mái ngay tại nhà";
      break;
    case "tiem-chung":
      desc = "Tiêm chủng an toàn với các cơ sở bệnh viện, phòng khám uy tín";
      break;
    default:
      desc = "Chưa cập nhập";
      break;
  }
  return desc;
}
