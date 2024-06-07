"use client";
import apiCategoryRequest from "@/apiRequest/ApiCategory";
import apiHospital, {IHospitalBody} from "@/apiRequest/ApiHospital";
import {HospitalsType} from "@/apiRequest/common";
import LocationIcon from "@/components/LocationIcon";
import PaginationSection from "@/components/PaginationSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import {generateDescription} from "@/lib/utils";
import {ClockIcon} from "@radix-ui/react-icons";
import {useQuery} from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import styles from "./HealthFacilities.module.scss";

const PAGE = 1;
const LIMIT = 10;
const CSYT = "co-so-y-te";
const typeMapping = {
  "benh-vien-cong": HospitalsType.BENHVIENCONG,
  "benh-vien-tu": HospitalsType.BENHVIENTU,
  "phong-kham": HospitalsType.PHONGKHAM,
  "phong-mach": HospitalsType.PHONGMACH,
  "xet-nghiem": HospitalsType.XETNGHIEM,
  "y-te-tai-nha": HospitalsType.YTETAINHA,
  "tiem-chung": HospitalsType.TIEMCHUNG,
};

export default function HealthFacilities({slug}: {slug?: string}) {
  const [hospitalSelected, setHospitalSelected] =
    useState<IHospitalBody | null>(null);
  const [isActive, setIsActive] = useState<string>("");
  const [type, setType] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(PAGE);
  const [itemsPerPage, _] = useState(LIMIT);

  const pathname = usePathname();
  const isActivePath = slug
    ? pathname === `/${CSYT}/${slug}`
    : pathname === `/${CSYT}`;

  const {data: categories} = useQuery({
    queryKey: [QUERY_KEY.GET_LIST_CATEGORY],
    queryFn: async () =>
      await apiCategoryRequest.getListCategory({
        page: 1,
        limit: 99,
      }),
  });

  const {data: hospitals, isFetching} = useQuery({
    queryKey: [
      QUERY_KEY.GET_LIST_HOSPITALS,
      {
        page: currentPage,
        limit: itemsPerPage,
        types: type,
      },
    ],
    queryFn: async () =>
      apiHospital.getListHospital({
        page: currentPage,
        limit: itemsPerPage,
        types: type,
      }),
  });

  useEffect(() => {
    if (slug && slug in typeMapping) {
      setType(typeMapping[slug as keyof typeof typeMapping].toString());
    }
  }, [hospitals?.payload?.data, slug]);

  const hospitalInfomation = Boolean(hospitalSelected)
    ? hospitalSelected
    : hospitals?.payload.data[0];

  const getNameCategory = useMemo(() => {
    if (slug) {
      return categories?.payload?.data.find((cate) => cate.slug === slug)?.name;
    }
    return categories?.payload?.data.find((cate) => cate.slug === CSYT)?.name;
  }, [categories?.payload?.data, slug]);

  const parentCategory = useMemo(() => {
    return categories?.payload?.data.find((cate) => cate.slug === CSYT);
  }, [categories?.payload?.data]);

  const typeOfHospitals = categories?.payload?.data.filter(
    (v) => v.parent_id === parentCategory?._id
  );

  return (
    <>
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbContainer}>
          <Breadcrumb className={styles.breadcrumbs}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className={styles.breadcrumbLink}>
                  Trang chủ
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className={clsx(
                    styles.breadcrumbLink,
                    isActivePath && styles.activeLink
                  )}
                >
                  {getNameCategory}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className={styles.hospitalContainer}>
        <div className={styles.header}>
          <h1 className={styles.hospitalTitle}>{getNameCategory}</h1>
          <span className={styles.hospitalDesc}>
            {generateDescription(slug as string)}
          </span>
          <div className={styles.search}>
            <Input
              type="text"
              placeholder="Tìm kiếm cơ sở y tế..."
              className="health-facilities_search"
            />
          </div>
        </div>
        <ul className={styles.tag}>
          {typeOfHospitals?.map((cate) => (
            <li key={cate._id}>
              <Button
                className={clsx(
                  styles.tagItem,
                  cate.slug === slug && styles.activeTagItem
                )}
              >
                <Link href={`/${CSYT}/${cate.slug}`}>{cate.name}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
      {/* CONTAINER */}
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.listHospital}>
            <div className={styles.left}>
              <div className={styles.leftBoxContainer}>
                {hospitals?.payload?.data?.map((v) => (
                  <div
                    key={v._id}
                    className={`bg-white rounded-2xl w-full ${
                      v._id === isActive ? "border-2 border-[#00b5f1]" : ""
                    }`}
                    role="button"
                    onClick={() => {
                      setHospitalSelected(v);
                      setIsActive(v._id as string);
                    }}
                  >
                    <div className={styles.leftBox}>
                      <div className={styles.leftImage}>
                        <Image
                          src={v.avatar || "/img/avatar/avatar.jpg"}
                          width={500}
                          height={500}
                          alt="image"
                        />
                      </div>
                      <div className={styles.leftInfo}>
                        <h2 className={styles.leftTitle}>{v.name}</h2>
                        <div className={styles.leftDesc}>
                          <LocationIcon className={styles.leftIcon} />
                          {v.address}
                        </div>
                        <div className={styles.leftBtnControl}>
                          <Button className={styles.btnMore}>
                            Xem chi tiết
                          </Button>
                          <Button className={styles.btnBooking}>
                            Đặt khám ngay
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className={styles.mobile}>
                      <div className={styles.leftBtnControl}>
                        <Button className={styles.btnMore}>Xem chi tiết</Button>
                        <Button className={styles.btnBooking}>
                          Đặt khám ngay
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.rightHospitalInfo}>
                <div className={styles.rightHeader}>
                  <div className={styles.rightImage}>
                    <Image
                      src={
                        hospitalInfomation?.avatar ?? "/img/avatar/avatar.jpg"
                      }
                      width={500}
                      height={500}
                      alt={hospitalInfomation?.name ?? "image"}
                    />
                  </div>
                  <h3 className={styles.rightTitle}>
                    {hospitalInfomation?.name ?? "Chưa cập nhập!!"}
                  </h3>
                  <div className={styles.rightSession}>
                    <ClockIcon className="w-5 h-5 text-[#ffb54a] inline-block" />
                    <span>{hospitalInfomation?.session}</span>
                  </div>
                </div>
                <p className={styles.rightDesc}>
                  {hospitalInfomation?.description ?? "Chưa cập nhập!!"}
                </p>
                <div className={styles.rightImages}>
                  <h4>Ảnh</h4>
                  {!!hospitalInfomation?.images?.length ? (
                    <div className={styles.rightImageList}>
                      {hospitalInfomation?.images?.map((image, index) => (
                        <div key={index} className={styles.rightImageItem}>
                          <Image
                            src={image}
                            width={110}
                            height={110}
                            alt="image"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>Chưa cập nhập!!</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <PaginationSection
              currentPage={hospitals?.payload?.meta?.current_page as number}
              totalPages={hospitals?.payload?.meta?.total_page as number}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
