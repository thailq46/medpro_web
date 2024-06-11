"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import {handleErrorApi} from "@/apiRequest/ErrorMessage/errors";
import {AppContext} from "@/app/(home)/AppProvider";
import {AvatarUpload} from "@/components/AvatarUpload";
import {CircleUserIcon} from "@/components/Icon";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Textarea} from "@/components/ui/textarea";
import {useToast} from "@/components/ui/use-toast";
import {cn} from "@/lib/utils";
import {
  AccountBody,
  AccountBodyType,
} from "@/module/account-management/form-config";
import {zodResolver} from "@hookform/resolvers/zod";
import {CalendarIcon, ReloadIcon} from "@radix-ui/react-icons";
import {format} from "date-fns";
import {vi} from "date-fns/locale";
import {useRouter} from "next/navigation";
import {useContext, useState} from "react";
import {useForm} from "react-hook-form";
import styles from "./Account.module.scss";

export default function AccountManagement({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const {user} = useContext(AppContext);
  const router = useRouter();
  const {toast} = useToast();
  const form = useForm<AccountBodyType>({
    resolver: zodResolver(AccountBody),
    defaultValues: {
      email: user?.email,
      avatar: user?.avatar,
      username: user?.username,
      date_of_birth: new Date(user?.date_of_birth ?? ""),
      gender: user?.gender,
      name: user?.name,
      phone_number: user?.phone_number,
      address: user?.address,
    },
  });

  async function onSubmit(values: AccountBodyType) {
    const dateOfBirth = values.date_of_birth.toISOString();
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiAuthRequest.updateMe({
        ...values,
        date_of_birth: dateOfBirth,
      });
      toast({
        title: "Thành công",
        description: result.payload.message,
        duration: 3000,
      });
      router.refresh();
    } catch (error) {
      setLoading(false);
      handleErrorApi({error, setError: form.setError, duration: 3000});
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={styles.dialogContent}>
        <Tabs defaultValue="account" className={styles.tabContainer}>
          <TabsList className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>Account</h2>
            <p className={styles.sidebarDesc}>Manage your account info.</p>
            <TabsTrigger
              value="account"
              className={`${styles.sidebarItem} mt-5`}
            >
              <CircleUserIcon className="w-5 h-5" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="password" className={styles.sidebarItem}>
              Password
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className={styles.tabContent}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="border-b border-gray-300 pb-4">
                  Profile details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[450px] overflow-y-scroll">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({field}) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <AvatarUpload
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-5">
                      <div className="flex flex-col gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({field}) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nhập email"
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
                          name="name"
                          render={({field}) => (
                            <FormItem>
                              <FormLabel>Họ và tên</FormLabel>
                              <FormControl>
                                <Input placeholder="Nhập name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="username"
                          render={({field}) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Nhập username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col gap-4">
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
                                        format(
                                          new Date(field.value),
                                          "dd/MM/yyyy"
                                        )
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
                                  <SelectTrigger
                                    className={styles.selectTrigger}
                                  >
                                    <SelectValue placeholder="Giới tính" />
                                  </SelectTrigger>
                                  <SelectContent className="z-[99999999999999]">
                                    <SelectGroup>
                                      <SelectItem
                                        value="0"
                                        className="cursor-pointer"
                                      >
                                        Nam
                                      </SelectItem>
                                      <SelectItem
                                        value="1"
                                        className="cursor-pointer"
                                      >
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
                          name="phone_number"
                          render={({field}) => (
                            <FormItem>
                              <FormLabel>Số điện thoại</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nhập số điện thoại"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập địa chỉ"
                              className="resize-none"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className={styles.btn_submit}
                      disabled={loading}
                    >
                      {loading && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Cập nhập thông tin
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving,
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
