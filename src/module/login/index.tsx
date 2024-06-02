import React from "react";
import styles from "./login.module.scss";
import {Button} from "@/components/ui/button";
import {ArrowLeftIcon} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/module/login/_component/LoginForm";
import LoginSocial from "@/module/login/_component/LoginSocial";

export default function Login() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.header}>
          <Button variant="ghost" size="icon" className="hover:bg-transparent">
            <ArrowLeftIcon className="w-6 h-6" color="#2698d6" />
          </Button>
          <div className="text-center h-[60px]">
            <Link href="#">
              <Image
                src="/img/logo.png"
                width={250}
                height={60}
                alt="logo"
                className="w-full h-full object-contain"
              />
            </Link>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.login_form}>
            <LoginForm />
            <LoginSocial />
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.shape}></div>
      </div>
    </div>
  );
}
