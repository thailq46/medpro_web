"use client";
import {IDoctorBody} from "@/apiRequest/ApiDoctor";
import {IServiceBody} from "@/apiRequest/ApiService";
import {AppContext} from "@/app/(home)/AppProvider";
import {CalendarIcon} from "@/components/Icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {cn, genderPosition} from "@/lib/utils";
import {
  BookingBody,
  BookingBodyType,
} from "@/module/booking-appointment/form-config";
import {zodResolver} from "@hookform/resolvers/zod";
import {format} from "date-fns";
import {vi} from "date-fns/locale";
import Image from "next/image";
import {useSearchParams} from "next/navigation";
import {useContext} from "react";
import {useForm} from "react-hook-form";

interface IModalBookingAppointmentProps {
  isOpen: boolean;
  handleOke?: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  doctor?: IDoctorBody;
  timeAppointment?: string;
  dateAppointment?: string;
  service?: IServiceBody;
}

export function ModalBookingAppointment({
  isOpen,
  setIsOpen,
  handleOke,
  doctor,
  timeAppointment,
  dateAppointment,
  service,
}: IModalBookingAppointmentProps) {
  const {user} = useContext(AppContext);
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature");
  const form = useForm<BookingBodyType>({
    resolver: zodResolver(BookingBody),
    defaultValues: {
      fullname: user?.name,
      phone_number: user?.phone_number,
      address: user?.address,
      reason: "",
      date_of_birth: new Date(user?.date_of_birth || ""),
      gender: user?.gender,
      email: user?.email,
    },
  });
  function onSubmit(values: BookingBodyType) {
    console.log(values);
  }
  const price = feature === "booking.date" ? service?.price : doctor?.price;
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="z-[99999999999] !max-w-[800px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Thông tin về đặt lịch khám bệnh
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex items-start gap-5">
              <div className="w-[90px] h-[90px]">
                <Image
                  src={doctor?.avatar || "/img/avatar/avatar.jpg"}
                  alt="doctor"
                  width={90}
                  height={90}
                  className="rounded-full w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-1 font-semibold">
                <span>
                  {genderPosition(doctor?.position as number) +
                    " " +
                    doctor?.name}
                </span>
                <span>
                  {timeAppointment} - {dateAppointment}
                </span>
                <span>
                  Giá tiền: {price?.toLocaleString("vi-Vn")}đ - {service?.name}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          disabled
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "dd/MM/yyyy")
                              ) : (
                                <span>Chọn ngày sinh</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full p-0 z-[99999999999999]"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            locale={vi}
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            defaultMonth={new Date(field.value)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(e) =>
                            form.setValue("gender", Number(e))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Giới tính" />
                          </SelectTrigger>
                          <SelectContent className="z-[99999999999999]">
                            <SelectGroup>
                              <SelectItem value="0" className="cursor-pointer">
                                Nam
                              </SelectItem>
                              <SelectItem value="1" className="cursor-pointer">
                                Nữ
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="reason"
              render={({field}) => (
                <FormItem className="!mt-0">
                  <FormLabel>Lý do khám bệnh</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập lý do khám bệnh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Huỷ</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleOke}
                role="button"
                type="submit"
              >
                Xác nhận
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
