"use client";
import React from "react";
import Navbar from "@/components/Layout/Navbar";
import styles from "./DashboardLayout.module.scss";
import Content from "@/components/Layout/Content";
import Footer from "@/components/Layout/Footer";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <Content>{children}</Content>
      <Footer />
    </div>
  );
}
