"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import apiCategoryRequest, {ICategoryBody} from "@/apiRequest/ApiCategory";
import {
  AT_COOKIE_NAME,
  CATE,
  QUERY_PARAMS,
  RT_COOKIE_NAME,
  VerifyStatus,
} from "@/apiRequest/common";
import {AppContext} from "@/app/(home)/AppProvider";
import {ModalConfirmCustom} from "@/components/ModalComfirm";
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
import {useToast} from "@/components/ui/use-toast";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import AccountManagement from "@/module/account-management";
import {
  ChatBubbleIcon,
  ExitIcon,
  HamburgerMenuIcon,
  PersonIcon,
  TriangleDownIcon,
} from "@radix-ui/react-icons";
import {useQuery} from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useContext, useMemo, useState} from "react";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  const [isModalAccountOpen, setIsModalAccountOpen] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [isCloseSheet, setIsCloseSheet] = useState(false);
  const router = useRouter();
  const {toast} = useToast();
  const {user} = useContext(AppContext);
  const {data} = useQuery({
    queryKey: [QUERY_KEY.GET_LIST_CATEGORY],
    queryFn: async () => await apiCategoryRequest.getListCategory(QUERY_PARAMS),
  });

  const categoryData = useMemo(() => {
    const categoryMap: {
      [key: string]: ICategoryBody & {children: ICategoryBody[]; icon: string};
    } = {};
    data?.payload?.data.forEach((category) => {
      if (category.parent_id === null) {
        let icon = "";
        switch (category.slug) {
          case CATE.CSYT:
            icon = "/tablet/CSYT.svg";
            break;
          case CATE.DVYT:
            icon = "/tablet/DVYT.svg";
            break;
          case CATE.KSKDN:
            icon = "/tablet/DVYT.svg";
            break;
          case CATE.TINTUC:
            icon = "/tablet/TinTuc.svg";
            break;
          case CATE.HUONGDAN:
            icon = "/tablet/HuongDan.svg";
            break;
          case CATE.LHHT:
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
    return categoryMap;
  }, [data?.payload?.data]);

  const handleLogout = async () => {
    try {
      await apiAuthRequest.logoutFromNextClientToNextServer();
      localStorage.removeItem(AT_COOKIE_NAME);
      localStorage.removeItem(RT_COOKIE_NAME);
      toast({
        title: "Thành công",
        description: "Đăng xuất thành công",
        duration: 3000,
      });
      router.push("/");
    } catch (error) {
      await apiAuthRequest
        .logoutFromNextClientToNextServer(true)
        .then(() => router.push("/"));
    } finally {
      window.location.reload();
    }
  };

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
          {Object.values(categoryData).map((category) => (
            <MenubarMenu key={category.name}>
              <MenubarTrigger>
                <Link
                  href={
                    category.slug === CATE.DVYT
                      ? "#"
                      : category.slug === CATE.CSYT
                      ? `/${CATE.CSYT}`
                      : `/${category.slug}`
                  }
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
                      <Link
                        className="block w-full"
                        href={`/${category.slug}/${child.slug}`}
                      >
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
      <div className={styles.right}>
        {!Boolean(user) ? (
          <Button
            className={styles.btnLogin}
            onClick={() => router.push("/login")}
          >
            <PersonIcon className="mr-2 h-4 w-4" />
            Tài khoản
          </Button>
        ) : (
          <>
            <AccountManagement
              isOpen={isModalAccountOpen}
              setIsOpen={setIsModalAccountOpen}
            />
            <ModalConfirmCustom
              isOpen={isModalConfirmOpen}
              setIsOpen={setIsModalConfirmOpen}
              title={"Đăng xuất"}
              content={"Bạn có chắc chắn muốn đăng xuất?"}
              handleOke={handleLogout}
            />
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
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsModalAccountOpen(true)}
                >
                  <PersonIcon className="mr-2 h-4 w-4" />
                  Quản lý tài khoản
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user?.verify === VerifyStatus.VERIFIED && (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push("/chat")}
                    >
                      <ChatBubbleIcon className="mr-2 h-4 w-4" />
                      Tin nhắn
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsModalConfirmOpen(true)}
                >
                  <ExitIcon className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        {/* NAV for TABLET */}
        <div className={styles.tablet}>
          <Sheet open={isCloseSheet} onOpenChange={setIsCloseSheet}>
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
                {!user && (
                  <>
                    <Button className="w-[calc(50%-5px)] mr-1" asChild>
                      <Link href="/register">Đăng ký</Link>
                    </Button>
                    <Button className="w-[calc(50%-5px)] ml-1" asChild>
                      <Link href="/login">Đăng nhập</Link>
                    </Button>
                  </>
                )}
                <div>
                  <Accordion type="single" collapsible className="w-full">
                    {Object.values(categoryData).map((cate, index) => (
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
                          <Link
                            className="font-semibold text-base"
                            href={`/${cate.slug}`}
                            onClick={() => setIsCloseSheet(false)}
                          >
                            {cate.name}
                          </Link>
                        </AccordionTrigger>
                        {!!cate.children.length && (
                          <AccordionContent>
                            {cate.children?.map((child, index) => (
                              <div
                                key={index}
                                className="py-2 px-5 font-medium border-b border-slate-300 last:border-none last:pb-0"
                              >
                                <Link
                                  href={`/${cate.slug}/${child.slug}`}
                                  onClick={() => setIsCloseSheet(false)}
                                >
                                  {child.name}
                                </Link>
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
