import {z} from "zod";

const REGEX_STRING =
  /^[a-zA-ZàáảạãÀÁẢẠÃâầấẩậẫÂẦẤẨẬẪăằắẳặẵĂẰẮẲẶẴđĐèéẻẹẽÈÉẺẸẼêềếểệễÊỀẾỂỆỄìíỉịĩÌÍỈỊĨòóỏọõÒÓỎỌÕôồốổộỗÔỒỐỔỘỖơờớởợỡƠỜỚỞỢỠùúủụũÙÚỦỤŨưừứửựữƯỪỨỬỰỮỳýỷỵỹỲÝỶỴỸ ]+$/;

const REGEX_DATE_IOS8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const REGEX_PHONE_VN = /^(-84|\+84|0)[3,5,7,8,9]\d{8,8}$/;
const REGEX_NO_SPACE = /\S/;

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
  avatar: z.string().trim(),
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

export type AccountBodyType = z.TypeOf<typeof AccountBody>;
