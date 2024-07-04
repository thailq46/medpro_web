import AppProvider from "@/app/(home)/AppProvider";
import Content from "@/components/Layout/Content";
import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import {Toaster} from "@/components/ui/toaster";
import type {Metadata} from "next";
import {Manrope} from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "../global.scss";

const manrope = Manrope({
  weight: ["400", "500", "700", "800"],
  subsets: ["vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Medpro",
    default: "Phần mềm đăng ký khám chữa bệnh online",
  },
  description: "Được tạo bởi Lê Quang Thái",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <AppProvider>
          <div className="wrapper">
            <NextTopLoader color="#00b5f1" />
            <Navbar />
            <Content>{children}</Content>
            <Footer />
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
