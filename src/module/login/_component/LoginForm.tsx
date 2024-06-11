"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import {handleErrorApi} from "@/apiRequest/ErrorMessage/errors";
import {clientAccessToken} from "@/apiRequest/http";
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
import {zodResolver} from "@hookform/resolvers/zod";
import {ReloadIcon} from "@radix-ui/react-icons";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import styles from "../login.module.scss";

const LoginBody = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string(),
  })
  .strict();
type LoginBodyType = z.TypeOf<typeof LoginBody>;

export default function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const {toast} = useToast();
  const router = useRouter();
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
      toast({
        title: "Thành công",
        description: result.payload.message,
        duration: 3000,
      });
      const {access_token, refresh_token} = result.payload.data;
      const decoded = jwtDecode(access_token);
      const expiredAt = decoded.exp;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      await apiAuthRequest.auth({
        access_token,
        refresh_token,
        expiresAt: expiredAt as number,
      });
      clientAccessToken.expiresAt = expiredAt as number;
      router.push("/");
      router.refresh();
    } catch (error) {
      setLoading(false);
      handleErrorApi({error, setError: form.setError, duration: 3000});
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
        <Button type="submit" className={styles.btn_submit} disabled={loading}>
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
}
