"use client";
import React from "react";
import Navbar from "@/components/Layout/Navbar";
import styles from "./DashboardLayout.module.scss";
import Content from "@/components/Layout/Content";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <Content>{children}</Content>
    </div>
  );
}
