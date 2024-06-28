"use client";
import apiSearch from "@/apiRequest/ApiSearch";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import useDebounce from "@/hooks/useDebounce";
import HomeInfo from "@/module/home/_component/HomeHeader/HomeInfo";
import HomeService from "@/module/home/_component/HomeHeader/HomeService";
import HomeStatistic from "@/module/home/_component/HomeHeader/HomeStatistic";
import {useQuery} from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {ChangeEvent, useState} from "react";
import styles from "./HomeHeader.module.scss";

const LIMIT = 4;

export default function HomeHeader() {
  const [value, setValue] = useState("");

  const searchValueDebounce = useDebounce(value, 500);

  const {data, isLoading} = useQuery({
    queryKey: [
      QUERY_KEY.GET_SEARCH,
      {category: "all", limit: LIMIT, search_key: searchValueDebounce},
    ],
    queryFn: () =>
      apiSearch.search({
        category: "all",
        limit: LIMIT,
        search_key: searchValueDebounce,
      }),
  });
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <section className={`home-header ${styles.container}`}>
      <div className={styles.banner}>
        <div className={styles.content}>
          <span className="text-[#11a2f3] text-[25px] mb-2 font-medium">
            Nền tảng công nghệ
          </span>
          <h3 className={styles.title}>
            Kết nối người dân với Cơ sở - Dịch vụ Y tế
          </h3>
          <div className={styles.search}>
            <Input
              type="search"
              placeholder="Tìm kiếm cơ sở y tế"
              className="home-header_search"
              value={value}
              onChange={onChange}
            />
            <div className={styles.searchBox}>
              {!!value && isLoading ? (
                <>
                  <div className="bg-white p-3">
                    {Array.from({length: 2}).map((_, index) => (
                      <div className="flex items-start gap-4 mt-4" key={index}>
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="w-full">
                          <Skeleton className="w-full h-5" />
                          <Skeleton className="w-full h-10 mt-4" />
                          <Skeleton className="w-full h-10 mt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {!!data?.payload?.data?.hospital?.length && value !== "" && (
                    <>
                      <div className="flex items-center justify-between p-3 bg-[#e6f2ff]">
                        <h3 className="font-bold">Cơ sở y tế</h3>
                        <Link
                          href="#"
                          className="text-sm italic text-textSecondary hover:underline"
                        >
                          Xem tất cả
                        </Link>
                      </div>
                      {data?.payload?.data?.hospital?.map((value) => (
                        <div className={styles.searchBoxItem} key={value._id}>
                          <div className={styles.searchBoxImage}>
                            <Image
                              src={value.avatar || "/img/avatar/avatar.jpg"}
                              width={80}
                              height={80}
                              alt="search-box"
                            />
                          </div>
                          <div className={styles.searchBoxContent}>
                            <h4 className={styles.searchBoxTitle}>
                              {value.name}
                            </h4>
                            <span className={styles.searchBoxDesc}>
                              {value.address}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {!!data?.payload?.data?.doctor?.length && value !== "" && (
                    <>
                      <div className="flex items-center justify-between p-3 bg-[#e6f2ff]">
                        <h3 className="font-bold">Bác sĩ</h3>
                        <Link
                          href="#"
                          className="text-sm italic text-textSecondary hover:underline"
                        >
                          Xem tất cả
                        </Link>
                      </div>
                      {data?.payload?.data?.doctor?.map((value) => (
                        <div className={styles.searchBoxItem} key={value._id}>
                          <div className={styles.searchBoxImage}>
                            <Image
                              src={value.avatar || "/img/avatar/avatar.jpg"}
                              width={80}
                              height={80}
                              alt="search-box"
                            />
                          </div>
                          <div className={styles.searchBoxContent}>
                            <h4 className={styles.searchBoxTitle}>
                              {value.name} - {value.specialty?.hospital?.name}
                            </h4>
                            <span className={styles.searchBoxDesc}>
                              {value.specialty?.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <span className={styles.desc}>
            Đặt khám nhanh - Lấy số thứ tự trực tuyến - Tư vấn sức khỏe từ xa
          </span>
        </div>
        <HomeService />
      </div>
      <div className={styles.main}>
        <HomeInfo />
        <HomeStatistic />
      </div>
    </section>
  );
}
