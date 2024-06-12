import {z} from "zod";

export const REGEX_STRING =
  /^[a-zA-ZàáảạãÀÁẢẠÃâầấẩậẫÂẦẤẨẬẪăằắẳặẵĂẰẮẲẶẴđĐèéẻẹẽÈÉẺẸẼêềếểệễÊỀẾỂỆỄìíỉịĩÌÍỈỊĨòóỏọõÒÓỎỌÕôồốổộỗÔỒỐỔỘỖơờớởợỡƠỜỚỞỢỠùúủụũÙÚỦỤŨưừứửựữƯỪỨỬỰỮỳýỷỵỹỲÝỶỴỸ ]+$/;

const REGEX_DATE_IOS8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const REGEX_PHONE_VN = /^(-84|\+84|0)[3,5,7,8,9]\d{8,8}$/;
const REGEX_NO_SPACE = /\S/;
export const REGEX_SYMBOL = /[!@#$%^&*(),.?":{}|<>]/;

export const AccountBody = z.object({
  username: z
    .string()
    .trim()
    .min(1, {message: "Username là bắt buộc"})
    .max(255, {message: "Username không được vượt quá 255 kí tự"})
    .regex(/^[A-Za-z0-9_]+$/, {
      message: "Username không hợp lệ",
    }),
  name: z
    .string()
    .trim()
    .min(1, {message: "Tên là bắt buộc"})
    .max(255, {message: "Username không được vượt quá 255 kí tự"})
    .regex(REGEX_STRING, {
      message: "Chỉ chấp nhận chữ cái và dấu cách",
    }),
  avatar: z.union([z.string().trim(), z.instanceof(File)]),
  gender: z.number().int(),
  date_of_birth: z.date({
    required_error: "Ngày sinh không được để trống",
  }),
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

const passwordSchema = z
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
