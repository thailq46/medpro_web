"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import {handleErrorApi} from "@/apiRequest/ErrorMessage/errors";
import PasswordInput from "@/components/InputPassword";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useToast} from "@/components/ui/use-toast";
import {
  ChangePasswordBody,
  ChangePasswordBodyType,
} from "@/module/account-management/form-config";
import {zodResolver} from "@hookform/resolvers/zod";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useForm} from "react-hook-form";

export default function SecurityForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const {toast} = useToast();
  const router = useRouter();
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  async function onSubmit(values: ChangePasswordBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiAuthRequest.changePassword(values);
      toast({
        title: "Thành công",
        description: result.payload.message,
        duration: 3000,
      });
      form.reset();
      router.refresh();
    } catch (error) {
      setLoading(false);
      handleErrorApi({error, setError: form.setError, duration: 3000});
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="border-b border-gray-300 pb-4">
          Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Password</Label>
          <Label>••••••••••</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-xs">
                Update password
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[999999999999]" align="end">
              <Label className="font-extrabold">Update password</Label>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 mt-3 text-xs"
                >
                  <FormField
                    control={form.control}
                    name="old_password"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Current password</FormLabel>
                        <FormControl>
                          <PasswordInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="new_password"
                    render={({field}) => (
                      <FormItem className="space-y-1  !mt-3">
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                          <PasswordInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirm_new_password"
                    render={({field}) => (
                      <FormItem className="space-y-1  !mt-3">
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <PasswordInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Cập nhập mật khẩu
                  </Button>
                </form>
              </Form>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
