import {IServiceBody} from "@/apiRequest/ApiService";
import {BOOKING, PARAMS, PositionType, STEP_NAME} from "@/apiRequest/common";
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

export const renderPosition = (position: number): string => {
  if (position === PositionType.ASSOCIATE_PROFESSOR) return "Phó giáo sư";
  if (position === PositionType.DOCTOR) return "Tiến sĩ";
  if (position === PositionType.PROFESSOR) return "Giáo sư";
  if (position === PositionType.MASTER) return "Thạc sĩ";
  return "";
};

export const getStepNameAndServiceId = ({
  specialty_id,
  services,
}: {
  specialty_id: string;
  services: IServiceBody[];
}) => {
  const result = services.filter(
    (service) => service.specialty?._id === specialty_id
  );
  const stepName = !!result?.length ? "service" : "date";
  const serviceId = !!result?.length
    ? ""
    : services.find((v) => v.specialty === null && v.type === "service")?._id;
  return {stepName, serviceId};
};

export const generateQueryString = ({
  name,
  hospitalId,
}: {
  name: string;
  hospitalId: string;
}) => {
  const query = new URLSearchParams();
  let feature = "";
  let stepName = "";
  switch (name.trim()) {
    case "Đặt khám theo chuyên khoa":
      feature = BOOKING.DATE;
      stepName = STEP_NAME.SUBJECT;
      break;
    case "Đặt khám theo bác sĩ":
      feature = BOOKING.DOCTOR;
      stepName = STEP_NAME.DOCTOR;
      break;
    case "Tiêm chủng":
      feature = BOOKING.VACCINE;
      stepName = STEP_NAME.SERVICE;
      break;
    case "Gói khám sức khoẻ":
      feature = BOOKING.PACKAGE;
      stepName = STEP_NAME.SERVICE;
      break;
    default:
      feature = "";
      break;
  }
  query.append(PARAMS.FEATURE, feature);
  query.append(PARAMS.HOSPITAL_ID, hospitalId as string);
  query.append(PARAMS.STEP_NAME, stepName);
  return "/chon-lich-kham?" + query.toString();
};

export function generateDescription(slug: string): {
  desc: string;
  metadata: string;
} {
  let obj = {
    desc: "",
    metadata: "",
  };
  switch (slug) {
    case "benh-vien-cong":
      obj = {
        desc: "Đặt khám dễ dàng, không lo chờ đợi tại các bệnh viện công hàng đầu Việt Nam",
        metadata: "Đặt khám dễ dàng, đi khám khoẻ re",
      };
      break;
    case "benh-vien-tu":
      obj = {
        desc: "Tận hưởng dịch vụ y tế tư nhân, chăm sóc sức khỏe chuyên nghiệp",
        metadata: "Chăm sóc sức khỏe chuyên nghiệp",
      };
      break;
    case "phong-kham":
      obj = {
        desc: "Trải nghiệm chăm sóc y tế tập trung và gần gũi tại phòng khám chuyên khoa",
        metadata: "Chăm sóc cá nhân chuyên nghiệp",
      };
      break;
    case "phong-mach":
      obj = {
        desc: "Chẩn đoán và điều trị chất lượng với bác sĩ chuyên khoa được nhiều người tin tưởng",
        metadata: "Dịch vụ y tế cá nhân uy tín, chuyên sâu",
      };
      break;
    case "xet-nghiem":
      obj = {
        desc: "Xét nghiệm chính xác, nhanh chóng và hỗ trợ chẩn đoán hiệu quả với các cơ sở uy tín hàng đầu",
        metadata: "Xét nghiệm y tế với cơ sở uy tín, an toàn và nhanh chóng",
      };
      break;
    case "y-te-tai-nha":
      obj = {
        desc: "Chăm sóc sức khỏe tiện lợi và thoải mái ngay tại nhà",
        metadata: "Chăm sóc sức khỏe mọi lúc mọi nơi",
      };
      break;
    case "tiem-chung":
      obj = {
        desc: "Tiêm chủng an toàn với các cơ sở bệnh viện, phòng khám uy tín",
        metadata: "Tiêm chủng an toàn, phòng ngừa bệnh hiệu quả",
      };
      break;
    default:
      obj = {
        desc: "Chưa cập nhật",
        metadata: "Chưa cập nhật",
      };
      break;
  }
  return obj;
}
