import type {Metadata} from "next";
import {Manrope} from "next/font/google";
import {Toaster} from "@/components/ui/toaster";
import "../global.scss";

const manrope = Manrope({
  weight: ["300", "400", "500", "700", "800"],
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Login",
  description: "Medpro | Phần mềm đăng ký khám chữa bệnh online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
