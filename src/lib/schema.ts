import {
  REGEX_NO_SPACE,
  REGEX_PHONE_VN,
  REGEX_STRING,
  REGEX_SYMBOL,
} from "@/lib/regex";
import {z} from "zod";

export const passwordSchema = z
  .string()
  .trim()
  .min(6, {message: "Mật khẩu phải nhiều hơn 6 kí tự"})
  .max(50, {message: "Mật khẩu không được vượt quá 50 kí tự"})
  .regex(/[a-z]/, {message: "Mật khẩu phải chứa ít nhất 1 chữ thường"})
  .regex(/[A-Z]/, {message: "Mật khẩu phải chứa ít nhất 1 chữ hoa"})
  .regex(/[0-9]/, {message: "Mật khẩu phải chứa ít nhất 1 số"})
  .regex(REGEX_SYMBOL, {
    message: "Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt",
  });

export const nameSchema = z
  .string()
  .trim()
  .min(1, {message: "Tên là bắt buộc"})
  .max(255, {message: "Tên không được vượt quá 255 kí tự"})
  .regex(REGEX_STRING, {
    message: "Chỉ chấp nhận chữ cái và dấu cách",
  });

export const genderSchema = z.number().int();

export const dateOfBirthSchema = z.date({
  required_error: "Ngày sinh không được để trống",
});

export const emailSchema = z.string().email({message: "Email không hợp lệ"});

export const addressSchema = z
  .string()
  .trim()
  .max(255, {message: "Địa chỉ không được vượt quá 255 kí tự"})
  .regex(REGEX_NO_SPACE, {
    message: "Không được chỉ chứa khoảng trắng",
  });

export const phoneNumberSchema = z.string().regex(REGEX_PHONE_VN, {
  message: "Số điện thoại không hợp lệ",
});
