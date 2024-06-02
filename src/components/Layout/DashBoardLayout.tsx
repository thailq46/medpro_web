"use client";
import React from "react";
import Navbar from "@/components/Layout/Navbar";
import styles from "./DashboardLayout.module.scss";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div>{children}</div>
    </div>
  );
}
