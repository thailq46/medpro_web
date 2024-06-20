import {REGEX_NO_SPACE, REGEX_PHONE_VN, REGEX_USERNAME} from "@/lib/regex";
import {
  dateOfBirthSchema,
  genderSchema,
  nameSchema,
  passwordSchema,
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
  phone_number: z.string().regex(REGEX_PHONE_VN, {
    message: "Số điện thoại không hợp lệ",
  }),
  email: z.string().trim(),
  address: z
    .string()
    .trim()
    .max(255, {message: "Địa chỉ không được vượt quá 255 kí tự"})
    .regex(REGEX_NO_SPACE, {
      message: "Không được chỉ chứa khoảng trắng",
    }),
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
