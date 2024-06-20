"use client";
import apiHospital from "@/apiRequest/ApiHospital";
import {HospitalsType, LIMIT, PAGE} from "@/apiRequest/common";
import {LocationIcon} from "@/components/Icon";
import EmptyList from "@/components/Layout/EmptyList";
import PaginationSection from "@/components/PaginationSection";
import {Button} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Skeleton} from "@/components/ui/skeleton";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import {MagnifyingGlassIcon} from "@radix-ui/react-icons";
import {useQuery} from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useMemo, useState} from "react";
import styles from "./FacilityBooking.module.scss";

export default function FacilityBooking() {
  const [active, setActive] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(PAGE);
  const [itemsPerPage, _] = useState<number>(LIMIT);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  const typeOfHospitals = useMemo(() => {
    return [
      {name: "Tất cả", value: "all"},
      {name: "Bệnh viện", value: "hospital"},
      {name: "Phòng khám/ Phòng mạch/ Xét nghiệm/ Khác", value: "others"},
    ];
  }, []);

  const page = active === "all" ? currentPage : PAGE;
  const limit = active === "all" ? itemsPerPage : 99;

  const {data: hospitals, isLoading: isLoadingHospital} = useQuery({
    queryKey: [QUERY_KEY.GET_LIST_HOSPITALS, {page, limit, search}],
    queryFn: async () => apiHospital.getListHospital({page, limit, search}),
  });

  const hospitalDataFilter = hospitals?.payload?.data?.filter((v) => {
    switch (active) {
      case "hospital":
        return v.types?.some(
          (type) =>
            type === HospitalsType.BENHVIENCONG ||
            type === HospitalsType.BENHVIENTU
        );
      case "others":
        return v.types?.some(
          (type) =>
            type === HospitalsType.PHONGKHAM ||
            type === HospitalsType.PHONGMACH ||
            type === HospitalsType.XETNGHIEM ||
            type === HospitalsType.YTETAINHA ||
            type === HospitalsType.TIEMCHUNG
        );
      default:
        return true;
    }
  });

  const hospitalData =
    active === "all" ? hospitals?.payload?.data : hospitalDataFilter;

  return (
    <>
      <div className={styles.bannerWrapper}>
        <div className={styles.bannerContainer}>
          <div className={styles.card}>
            <h1 className={styles.title}>Đặt khám tại cơ sở</h1>
            <span className={styles.desc}>
              Đặt khám nhanh chóng, tiết kiệm thời gian, an toàn tiện lợi
            </span>
          </div>
          <div className={styles.bannerImage}>
            <Image
              src="/img/facility-booking.png"
              alt="Banner"
              width={1000}
              height={1000}
              className="w-full h-full object-center"
            />
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.container}>
          <div className={styles.search}>
            <MagnifyingGlassIcon className="w-5 h-5" />
            <input
              type="search"
              placeholder="Nhập tên cơ sở y tế"
              onChange={(e) => setSearch(e.target.value)}
            />
            <LocationIcon className="w-4 h-4" />
            <Select>
              <SelectTrigger className="w-[180px] border-none outline-none  focus:ring-transparent">
                <SelectValue placeholder="Tất cả địa điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="null">Tất cả địa điểm</SelectItem>
                  <SelectItem value="hà nội">Thành phố Hà nội</SelectItem>
                  <SelectItem value="hcm">Thành phố Hồ Chí Minh</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <ul className={styles.tag}>
            {typeOfHospitals?.map((cate) => (
              <li key={cate.name}>
                <Button
                  className={clsx(
                    styles.tagItem,
                    active === cate.value && styles.active
                  )}
                  onClick={() => setActive(cate.value)}
                >
                  {cate.name}
                </Button>
              </li>
            ))}
          </ul>
          <div className={styles.listHospital}>
            {!isLoadingHospital ? (
              hospitalData?.map((v) => (
                <div
                  key={v._id}
                  className={`bg-white rounded-2xl w-full h-full border-2 hover:border-[#00b5f1] transition-all`}
                  role="button"
                  onClick={() => router.push(`/${v.slug}/hinh-thuc-dat-kham`)}
                >
                  <div className={styles.box}>
                    <div className={styles.hospitalBox}>
                      <div className={styles.hospitalImage}>
                        <Image
                          src={v.avatar || "/img/avatar/avatar.jpg"}
                          width={500}
                          height={500}
                          alt="image"
                        />
                      </div>
                      <div className={styles.hospitalInfo}>
                        <h2 className={styles.hospitalTitle}>{v.name}</h2>
                        <div className={styles.hospitalDesc}>
                          <LocationIcon className={styles.hospitalIcon} />
                          {v.address}
                        </div>
                        <div className={styles.btnControl}>
                          <Button className={styles.btnMore}>
                            Xem chi tiết
                          </Button>
                          <Button className={styles.btnBooking} asChild>
                            <Link href={`/${v.slug}/hinh-thuc-dat-kham`}>
                              Đặt khám ngay
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* MOBILE */}
                  <div className={styles.mobile}>
                    <div className={styles.btnControl}>
                      <Button className={styles.btnMore}>Xem chi tiết</Button>
                      <Button className={styles.btnBooking} asChild>
                        <Link href={`/${v.slug}/hinh-thuc-dat-kham`}>
                          Đặt khám ngay
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <SkeletonLoading />
            )}
          </div>
          {!hospitalData?.length && !isLoadingHospital && <EmptyList />}
          <div className="mt-5">
            {active === "all" && !!hospitalData?.length && (
              <PaginationSection
                currentPage={hospitals?.payload?.meta?.current_page as number}
                totalPages={hospitals?.payload?.meta?.total_page as number}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function SkeletonLoading() {
  return Array.from({length: 8}).map((_, index) => (
    <div
      className="bg-white w-full rounded-2xl p-3 flex items-start gap-4"
      key={index}
    >
      <div>
        <Skeleton className="w-[80px] h-[80px]" />
      </div>
      <div className="w-full">
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-5 mt-2" />
        <Skeleton className="w-full h-5 mt-2" />
        <div className="flex items-center gap-3 mt-3">
          <Skeleton className="w-1/2 h-9 rounded-full mt-2" />
          <Skeleton className="w-1/2 h-9 rounded-full mt-2" />
        </div>
      </div>
    </div>
  ));
}
