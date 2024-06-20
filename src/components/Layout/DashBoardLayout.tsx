"use client";
import Content from "@/components/Layout/Content";
import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import NextTopLoader from "nextjs-toploader";
import React from "react";
import styles from "./DashboardLayout.module.scss";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <NextTopLoader color="#00b5f1" />
      <Navbar />
      <Content>{children}</Content>
      <Footer />
    </div>
  );
}
