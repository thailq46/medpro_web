import {
  REGEX_NO_SPACE,
  REGEX_PHONE_VN,
} from "@/module/account-management/form-config";
import {z} from "zod";

export const BookingBody = z.object({
  fullname: z
    .string()
    .min(1, {message: "Họ và tên không được để trống"})
    .max(100, {message: "Họ và tên không được quá 100 ký tự"}),
  phone_number: z.string().regex(REGEX_PHONE_VN, {
    message: "Số điện thoại không hợp lệ",
  }),
  address: z
    .string()
    .trim()
    .max(255, {message: "Địa chỉ không được vượt quá 255 kí tự"})
    .regex(REGEX_NO_SPACE, {
      message: "Không được chỉ chứa khoảng trắng",
    }),
  reason: z
    .string()
    .min(1, {message: "Lý do không được để trống"})
    .max(500, {message: "Lý do không được vượt quá 500 kí tự"})
    .regex(REGEX_NO_SPACE, {
      message: "Không được chỉ chứa khoảng trắng",
    }),
  gender: z.number().int(),
  date_of_birth: z.date({
    required_error: "Ngày sinh không được để trống",
  }),
  email: z.string().email({message: "Email không hợp lệ"}),
});

export type BookingBodyType = z.TypeOf<typeof BookingBody>;
