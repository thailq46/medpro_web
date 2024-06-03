/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import styles from "./Navbar.module.scss";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {TriangleDownIcon, PersonIcon, ExitIcon} from "@radix-ui/react-icons";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const isLogin = false;
  const categories = [
    {
      name: "Cơ sở y tế",
      children: [
        {name: "Bệnh viện công"},
        {name: "Bệnh viện tư"},
        {name: "Phòng khám"},
      ],
    },
    {
      name: "Dịch vụ y tế",
      children: [
        {name: "Khám bệnh"},
        {name: "Chữa bệnh"},
        {name: "Đặt lịch khám"},
      ],
    },
    {name: "Khám sức khoẻ doanh nghiệp"},
    {name: "Tin tức"},
    {name: "Hướng dẫn"},
    {name: "Liên hệ hợp tác"},
  ];
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <a href="#" className="block w-[130px]">
          <img
            srcSet="/img/logo.png 2x"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </a>
        <Menubar className={styles.nav}>
          {categories.map((category) => (
            <MenubarMenu key={category.name}>
              <MenubarTrigger>
                {category.name} {!!category.children && <TriangleDownIcon />}
              </MenubarTrigger>
              {Boolean(category.children) && (
                <MenubarContent className="cursor-pointer relative z-[999]">
                  {category.children?.map((child) => (
                    <MenubarItem
                      key={child.name}
                      className="p-2 cursor-pointer hover:!text-textSecondary hover:!bg-[#e6f2ff] text-[13px] font-medium"
                    >
                      {child.name}
                    </MenubarItem>
                  ))}
                </MenubarContent>
              )}
            </MenubarMenu>
          ))}
        </Menubar>
      </div>
      <div className="right">
        {!isLogin ? (
          <Button>
            <PersonIcon className="mr-2 h-4 w-4" />
            Tài khoản
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback>VN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-46">
              <DropdownMenuItem className="cursor-pointer">
                <PersonIcon className="mr-2 h-4 w-4" />
                Tài khoản
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <ExitIcon className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
