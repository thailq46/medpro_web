import AppProvider from "@/app/(home)/AppProvider";
import {Toaster} from "@/components/ui/toaster";
import type {Metadata} from "next";
import {Manrope} from "next/font/google";
import "../global.scss";

const manrope = Manrope({
  weight: ["300", "400", "500", "700", "800"],
  subsets: ["vietnamese"],
});

export const metadata: Metadata = {
  title: "Login",
  description: "Medpro | Phần mềm đăng ký khám chữa bệnh online",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <AppProvider>{children}</AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
