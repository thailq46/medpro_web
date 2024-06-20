import {REGEX_USERNAME} from "@/lib/regex";
import {
  addressSchema,
  dateOfBirthSchema,
  genderSchema,
  nameSchema,
  passwordSchema,
  phoneNumberSchema,
} from "@/lib/schema";
import {z} from "zod";

export const AccountBody = z.object({
  username: z
    .string()
    .trim()
    .min(1, {message: "Username là bắt buộc"})
    .max(255, {message: "Username không được vượt quá 255 kí tự"})
    .regex(REGEX_USERNAME, {
      message: "Username không hợp lệ",
    }),
  name: nameSchema,
  avatar: z.union([z.string().trim(), z.instanceof(File)]),
  gender: genderSchema,
  date_of_birth: dateOfBirthSchema,
  phone_number: phoneNumberSchema,
  email: z.string().trim(),
  address: addressSchema,
});

export type AccountBodyType = z.TypeOf<typeof AccountBody>;

export const ChangePasswordBody = z
  .object({
    old_password: passwordSchema,
    new_password: passwordSchema,
    confirm_new_password: passwordSchema,
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Xác nhận mật khẩu mới không khớp",
    path: ["confirm_new_password"],
  });
export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>;
