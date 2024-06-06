"use client";
import apiCategoryRequest from "@/apiRequest/ApiCategory";
import LocationIcon from "@/components/LocationIcon";
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
import {ClockIcon} from "@radix-ui/react-icons";
import {useQuery} from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useMemo} from "react";
import styles from "./HealthFacilities.module.scss";

export default function HealthFacilities({slug}: {slug: string}) {
  const pathname = usePathname();
  const isActive = pathname === `/${slug}`;

  const {data: categories} = useQuery({
    queryKey: [QUERY_KEY.GET_LIST_CATEGORY],
    queryFn: async () =>
      await apiCategoryRequest.getListCategory({page: 1, limit: 99}),
  });

  const getNameCategory = useMemo(() => {
    return categories?.payload?.data.find((cate) => cate.slug === slug)?.name;
  }, [categories?.payload?.data, slug]);

  const parentCategory = useMemo(() => {
    return categories?.payload?.data.find((cate) => cate.slug === "co-so-y-te");
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
                  href={slug}
                  className={clsx(
                    styles.breadcrumbLink,
                    isActive && styles.activeLink
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
            Với những cơ sở Y Tế hàng đầu sẽ giúp trải nghiệm khám, chữa bệnh
            của bạn tốt hơn
          </span>
          <div className={styles.search}>
            <Input
              type="text"
              placeholder={`Tìm kiếm ${getNameCategory}`}
              className="health-facilities_search"
            />
          </div>
        </div>
        <ul className={styles.tag}>
          {typeOfHospitals?.map((cate) => (
            <li key={cate._id}>
              <Button className={styles.tagItem}>
                <Link href={cate.slug}>{cate.name}</Link>
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
                {Array.from({length: 10}).map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl">
                    <div className={styles.leftBox}>
                      <div className={styles.leftImage}>
                        <Image
                          src="https://source.unsplash.com/random"
                          width={500}
                          height={500}
                          alt="image"
                        />
                      </div>
                      <div className={styles.leftInfo}>
                        <h2 className={styles.leftTitle}>
                          Bệnh viện đa khoa Singapore (Singapore General
                          Hospital)
                        </h2>
                        <p className={styles.leftDesc}>
                          <LocationIcon className={styles.leftIcon} />
                          Bukit Merah, Central Region, Singapore
                        </p>
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
                      src="https://source.unsplash.com/random"
                      width={500}
                      height={500}
                      alt="image"
                    />
                  </div>
                  <h3 className={styles.rightTitle}>
                    Bệnh viện đa khoa Singapore (Singapore General Hospital)
                  </h3>
                  <span className={styles.rightSession}>
                    <ClockIcon className="w-5 h-5 text-[#ffb54a]" />
                    Thứ 2 - Thứ 6
                  </span>
                </div>
                <p className={styles.rightDesc}>
                  Bệnh viện Đa khoa Singapore (Sing General Hospital - SGH) là
                  bệnh viện công lớn nhất Singapore với thiết bị y tế tân tiến
                  và đội ngũ bác sĩ có chuyên môn hàng đầu, đặc biệt là trong
                  chữa trị ung thư. Cùng tìm hiểu về Bệnh viện Đa khoa Singapore
                  và đưa ra quyết định khám chữa bệnh nước ngoài tốt nhất nhé!
                </p>
                <div className={styles.rightImages}>
                  <h4>Ảnh</h4>
                  <div className={styles.rightImageList}>
                    {Array.from({length: 5}).map((_, index) => (
                      <div key={index} className={styles.rightImageItem}>
                        <Image
                          src="https://source.unsplash.com/random"
                          width={110}
                          height={110}
                          alt="image"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
