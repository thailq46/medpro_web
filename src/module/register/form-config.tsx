import {
  dateOfBirthSchema,
  emailSchema,
  genderSchema,
  nameSchema,
  passwordSchema,
} from "@/lib/schema";
import {z} from "zod";

export const RegisterBody = z.object({
  name: nameSchema,
  gender: genderSchema,
  date_of_birth: dateOfBirthSchema,
  email: emailSchema,
  password: passwordSchema,
});
export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;
