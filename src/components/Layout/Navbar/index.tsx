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
import {
  TriangleDownIcon,
  PersonIcon,
  ExitIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

export default function Navbar() {
  const isLogin = true;
  const categories = [
    {
      name: "Cơ sở y tế",
      icon: "/tablet/CSYT.svg",
      children: [
        {name: "Bệnh viện công"},
        {name: "Bệnh viện tư"},
        {name: "Phòng khám"},
      ],
    },
    {
      name: "Dịch vụ y tế",
      icon: "/tablet/DVYT.svg",
      children: [
        {name: "Khám bệnh"},
        {name: "Chữa bệnh"},
        {name: "Đặt lịch khám"},
      ],
    },
    {name: "Khám sức khoẻ doanh nghiệp", icon: "/tablet/DVYT.svg"},
    {name: "Tin tức", icon: "/tablet/TinTuc.svg"},
    {name: "Hướng dẫn", icon: "/tablet/HuongDan.svg"},
    {name: "Liên hệ hợp tác", icon: "/tablet/Contact.svg"},
  ];
  return (
    <nav className={styles.container}>
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
          <Button className={styles.btnLogin}>
            <PersonIcon className="mr-2 h-4 w-4" />
            Tài khoản
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className={`cursor-pointer ${styles.avatar}`}
            >
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
        {/* NAV for TABLET */}
        <div className={styles.tablet}>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="bg-transparent outline-none border-none shadow-none"
              >
                <HamburgerMenuIcon className="w-7 h-7" />
              </Button>
            </SheetTrigger>
            <SheetContent className={styles.navTablet}>
              <SheetHeader className="py-[15px] px-4 border border-b-slate-300">
                <a href="#" className="block w-[130px]">
                  <img
                    srcSet="/img/logo.png 2x"
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </a>
              </SheetHeader>
              <div className="p-4">
                <Button className="w-[calc(50%-5px)] mr-1">Đăng ký</Button>
                <Button className="w-[calc(50%-5px)] ml-1">Đăng nhập</Button>
                <div className="mt-3">
                  <Accordion type="single" collapsible className="w-full">
                    {categories.map((cate, index) => (
                      <AccordionItem value={`"item-"${index}`} key={index}>
                        <AccordionTrigger className={styles.accordionTrigger}>
                          <div className="w-[24px] h-[18px]">
                            <Image
                              src={cate.icon}
                              width={50}
                              height={50}
                              alt="CSYT"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="font-semibold text-base">{cate.name}</p>
                        </AccordionTrigger>
                        {Boolean(cate.children) && (
                          <AccordionContent>
                            {cate.children?.map((child, index) => (
                              <div
                                key={index}
                                className="py-2 px-5 font-medium border-b border-slate-300 last:border-none last:pb-0"
                              >
                                {child.name}
                              </div>
                            ))}
                          </AccordionContent>
                        )}
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
              <SheetFooter></SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
