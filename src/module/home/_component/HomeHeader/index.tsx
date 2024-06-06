/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import {Input} from "@/components/ui/input";
import styles from "./HomeHeader.module.scss";
import HomeStatistic from "@/module/home/_component/HomeHeader/HomeStatistic";
import HomeInfo from "@/module/home/_component/HomeHeader/HomeInfo";
import HomeService from "@/module/home/_component/HomeHeader/HomeService";
import Image from "next/image";

export default function HomeHeader() {
  const [value, setValue] = React.useState("");
  const [myOptions, setMyOptions] = React.useState([]);
  const onChange = (e: any) => {
    setValue(e.target.value);
  };
  React.useEffect(() => {
    fetch("http://dummy.restapiexample.com/api/v1/employees")
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          myOptions.push(res.data[i].employee_name as never);
        }
        setMyOptions(myOptions);
      });
  }, []);

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
              type="text"
              placeholder="Tìm kiếm cơ sở y tế"
              className="home-header_search"
              value={value}
              onChange={onChange}
            />
            <div className={styles.searchBox}>
              {myOptions
                .filter((data: string) => {
                  const searchTerm = value.toLowerCase();
                  const name = data.toLowerCase();
                  return searchTerm && name.startsWith(searchTerm);
                })
                .map((name, index) => (
                  <div className={styles.searchBoxItem} key={index}>
                    <div className={styles.searchBoxImage}>
                      <Image
                        src="https://source.unsplash.com/random"
                        width={80}
                        height={80}
                        alt="search-box"
                      />
                    </div>
                    <div className={styles.searchBoxContent}>
                      <h4 className={styles.searchBoxTitle}>{name}</h4>
                      <span className={styles.searchBoxDesc}>
                        123 Lê Lợi, Quận 1, TP.HCM
                      </span>
                    </div>
                  </div>
                ))}
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
