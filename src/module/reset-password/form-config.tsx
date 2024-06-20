import {passwordSchema} from "@/lib/schema";
import {z} from "zod";

export const ResetPasswordBody = z
  .object({
    password: passwordSchema,
    confirm_password: passwordSchema,
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Xác nhận mật khẩu mới không khớp",
    path: ["confirm_password"],
  });
export type ResetPasswordBodyType = z.TypeOf<typeof ResetPasswordBody>;
