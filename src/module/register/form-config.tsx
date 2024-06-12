import {
  REGEX_STRING,
  REGEX_SYMBOL,
} from "@/module/account-management/form-config";
import {z} from "zod";

export const RegisterBody = z.object({
  name: z
    .string()
    .trim()
    .min(1, {message: "Tên là bắt buộc"})
    .max(255, {message: "Username không được vượt quá 255 kí tự"})
    .regex(REGEX_STRING, {
      message: "Chỉ chấp nhận chữ cái và dấu cách",
    }),
  gender: z.number().int(),
  date_of_birth: z.date({
    required_error: "Ngày sinh không được để trống",
  }),
  email: z.string().email({message: "Email không hợp lệ"}),
  password: z
    .string()
    .trim()
    .min(6, {message: "Mật khẩu phải nhiều hơn 6 kí tự"})
    .max(50, {message: "Mật khẩu không được vượt quá 50 kí tự"})
    .regex(/[a-z]/, {message: "Mật khẩu phải chứa ít nhất 1 chữ thường"})
    .regex(/[A-Z]/, {message: "Mật khẩu phải chứa ít nhất 1 chữ hoa"})
    .regex(/[0-9]/, {message: "Mật khẩu phải chứa ít nhất 1 số"})
    .regex(REGEX_SYMBOL, {
      message: "Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt",
    }),
});
export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;
