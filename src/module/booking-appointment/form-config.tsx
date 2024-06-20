import {REGEX_NO_SPACE} from "@/lib/regex";
import {
  addressSchema,
  dateOfBirthSchema,
  emailSchema,
  genderSchema,
  phoneNumberSchema,
} from "@/lib/schema";
import {z} from "zod";

export const BookingBody = z.object({
  fullname: z
    .string()
    .min(1, {message: "Họ và tên không được để trống"})
    .max(100, {message: "Họ và tên không được quá 100 ký tự"}),
  phone_number: phoneNumberSchema,
  address: addressSchema,
  reason: z
    .string()
    .min(1, {message: "Lý do không được để trống"})
    .max(500, {message: "Lý do không được vượt quá 500 kí tự"})
    .regex(REGEX_NO_SPACE, {
      message: "Không được chỉ chứa khoảng trắng",
    }),
  gender: genderSchema,
  date_of_birth: dateOfBirthSchema,
  email: emailSchema,
});

export type BookingBodyType = z.TypeOf<typeof BookingBody>;
