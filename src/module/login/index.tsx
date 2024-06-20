"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import {handleErrorApi} from "@/apiRequest/ErrorMessage/errors";
import {AT_COOKIE_NAME, IStatus, RT_COOKIE_NAME} from "@/apiRequest/common";
import {clientAccessToken} from "@/apiRequest/http";
import {ButtonSubmit} from "@/components/ButtonGlobal";
import {FacebookIcon, GoogleIcon} from "@/components/Icon";
import PasswordInput from "@/components/InputPassword";
import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useToast} from "@/components/ui/use-toast";
import {emailSchema, passwordSchema} from "@/lib/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import clsx from "clsx";
import {jwtDecode} from "jwt-decode";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import styles from "./login.module.scss";

const LoginBody = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();
type LoginBodyType = z.TypeOf<typeof LoginBody>;

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const {toast} = useToast();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: LoginBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiAuthRequest.login(values);
      if (result.status === IStatus.SUCCESS) {
        toast({
          title: "Thành công",
          description: result.payload.message,
          duration: 5000,
        });
        const {access_token, refresh_token} = result.payload.data;
        const decoded = jwtDecode(access_token);
        const expiredAt = decoded.exp;
        localStorage.setItem(AT_COOKIE_NAME, access_token);
        localStorage.setItem(RT_COOKIE_NAME, refresh_token);
        await apiAuthRequest.auth({
          access_token,
          refresh_token,
          expiresAt: expiredAt as number,
        });
        clientAccessToken.expiresAt = expiredAt as number;
        router.push("/");
        router.refresh();
      } else {
        toast({
          title: "Thất bại",
          description: result.payload.message,
          duration: 5000,
        });
      }
    } catch (error) {
      handleErrorApi({error, setError: form.setError, duration: 4000});
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={clsx(styles.formContainer, styles.signIn)}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div
                className="text-center h-[60px]"
                role="button"
                onClick={() => router.push("/")}
              >
                <Image
                  src="/img/logo.png"
                  width={250}
                  height={60}
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className={styles.title}>Đăng nhập</h1>
              <div className="flex items-center gap-3 mt-4">
                <Button className="p-0">
                  <div className={styles.socialIcon}>
                    <GoogleIcon className="w-5 h-5" />
                  </div>
                </Button>
                <Button className="p-0">
                  <div className={styles.socialIcon}>
                    <FacebookIcon className="w-5 h-5" />
                  </div>
                </Button>
              </div>
              <span className="text-center text-sm mt-2">
                Hoặc đăng nhập bằng tài khoản
              </span>
              <div className="w-full max-w-[500px] flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập email"
                          className={styles.input}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Nhập mật khẩu"
                          className={styles.input}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="ml-auto p-0"
                  variant={"ghost"}
                  onClick={() => router.push("/forgot-password")}
                >
                  Quên mật khẩu
                </Button>
                <ButtonSubmit
                  title="Đăng nhập"
                  loading={loading}
                  disabled={loading}
                />
              </div>
            </form>
          </Form>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-2">
            <Button
              variant="ghost"
              className="font-bold"
              onClick={() => router.push("/register")}
            >
              <span>Create your account</span>
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        <div className={styles.toggleContainer}>
          <div className={styles.right}>
            <div className={styles.shape}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
