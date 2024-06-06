"use client";
import apiCategoryRequest, {ICategoryBody} from "@/apiRequest/ApiCategory";
import {AppContext} from "@/app/(home)/AppProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import {
  ExitIcon,
  HamburgerMenuIcon,
  PersonIcon,
  TriangleDownIcon,
} from "@radix-ui/react-icons";
import {useQuery} from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {useContext} from "react";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  const {user} = useContext(AppContext);
  const {data} = useQuery({
    queryKey: [QUERY_KEY.GET_LIST_CATEGORY],
    queryFn: async () =>
      await apiCategoryRequest.getListCategory({page: 1, limit: 99}),
  });
  const categoryMap: {
    [key: string]: ICategoryBody & {children: ICategoryBody[]; icon: string};
  } = {};
  data?.payload?.data.forEach((category) => {
    if (category.parent_id === null) {
      let icon = "";
      switch (category.slug) {
        case "co-so-y-te":
          icon = "/tablet/CSYT.svg";
          break;
        case "dich-vu-y-te":
          icon = "/tablet/DVYT.svg";
          break;
        case "kham-suc-khoe-doanh-nghiep":
          icon = "/tablet/DVYT.svg";
          break;
        case "tin-tuc":
          icon = "/tablet/TinTuc.svg";
          break;
        case "huong-dan":
          icon = "/tablet/HuongDan.svg";
          break;
        case "lien-he-hop-tac":
          icon = "/tablet/Contact.svg";
          break;
        default:
          icon = "/tablet/CSYT.svg";
          break;
      }
      categoryMap[category._id] = {
        ...category,
        children: [],
        icon,
      };
    } else {
      if (category.parent_id in categoryMap) {
        categoryMap[category.parent_id].children.push(category);
      }
    }
  });
  return (
    <nav className={styles.container}>
      <div className={styles.left}>
        <Link href="/" className="block w-[130px]">
          <Image
            src="/img/logo.png"
            alt="Medpro Logo"
            width={500}
            height={500}
            className="w-full h-full object-contain"
          />
        </Link>
        <Menubar className={styles.nav}>
          {Object.values(categoryMap).map((category) => (
            <MenubarMenu key={category.name}>
              <MenubarTrigger>
                <Link
                  href={category.slug === "dich-vu-y-te" ? "#" : category.slug}
                >
                  {category.name}
                </Link>
                {!!category.children.length && <TriangleDownIcon />}
              </MenubarTrigger>
              {!!category.children.length && (
                <MenubarContent className="cursor-pointer relative z-[999]">
                  {category.children.map((child) => (
                    <MenubarItem
                      key={child.name}
                      className="p-2 cursor-pointer hover:!text-textSecondary hover:!bg-[#e6f2ff] text-[13px] font-medium"
                    >
                      <Link href={`${category.slug}/${child.slug}`}>
                        {child.name}
                      </Link>
                    </MenubarItem>
                  ))}
                </MenubarContent>
              )}
            </MenubarMenu>
          ))}
        </Menubar>
      </div>
      <div className="right">
        {!Boolean(user) ? (
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
                <AvatarImage src={user?.avatar} alt="Avatar" />
                <AvatarFallback>
                  <Image
                    src="/img/avatar/avatar.jpg"
                    alt="Avatar"
                    width={500}
                    height={500}
                  />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-46 z-[99999999]">
              <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
              <SheetHeader className="py-[10px] px-4 border border-b-slate-300">
                <Link href="/" className="block w-[130px]">
                  <Image
                    src="/img/logo.png"
                    alt="Medpro Logo"
                    width={500}
                    height={500}
                    className="w-full h-full object-contain"
                  />
                </Link>
              </SheetHeader>
              <div className="p-4">
                <Button className="w-[calc(50%-5px)] mr-1" asChild>
                  <Link href="/register">Đăng ký</Link>
                </Button>
                <Button className="w-[calc(50%-5px)] ml-1" asChild>
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <div className="mt-3">
                  <Accordion type="single" collapsible className="w-full">
                    {Object.values(categoryMap).map((cate, index) => (
                      <AccordionItem value={`"item-"${index}`} key={index}>
                        <AccordionTrigger className={styles.accordionTrigger}>
                          <div className="w-[24px] h-[18px]">
                            <Image
                              src={cate.icon}
                              width={50}
                              height={50}
                              alt={cate.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="font-semibold text-base">{cate.name}</p>
                        </AccordionTrigger>
                        {!!cate.children.length && (
                          <AccordionContent>
                            {cate.children?.map((child, index) => (
                              <div
                                key={index}
                                className="py-2 px-5 font-medium border-b border-slate-300 last:border-none last:pb-0"
                              >
                                <Link href={child.slug}>{child.name}</Link>
                              </div>
                            ))}
                          </AccordionContent>
                        )}
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
