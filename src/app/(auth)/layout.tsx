import type {Metadata} from "next";
import {Roboto} from "next/font/google";
import "../global.scss";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
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
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
