import React from "react";
import styles from "./HomeHeader.module.scss";
import Image from "next/image";

const statistic = [
  {
    image: "/img/list1.png",
    number: "2.2M+",
    title: "Lượt khám",
  },
  {
    image: "/img/list2.png",
    number: "40+",
    title: "Bệnh viện",
  },
  {
    image: "/img/list3.png",
    number: "50+",
    title: "Cơ sở Y tế",
  },
  {
    image: "/img/list4.png",
    number: "1000+",
    title: "Bác sĩ",
  },
  {
    image: "/img/list5.png",
    number: "138K+",
    title: "Lượt truy cập tháng",
  },
  {
    image: "/img/list6.png",
    number: "4600+",
    title: "Lượt truy cập trong ngày",
  },
];

export default function HomeStatistic() {
  return (
    <div className={styles.statistic}>
      <h3 className="text-[39px] font-bold text-white text-center mb-[60px]">
        Thống kê
      </h3>
      <ul className={styles.statisticList}>
        {statistic.map((item, i) => (
          <li key={i}>
            <div className={styles.statisticImages}>
              <Image
                src={item.image}
                width={110}
                height={110}
                alt="statistic"
              />
            </div>
            <span className={styles.statisticNumber}>{item.number}</span>
            <span className={styles.statisticTitle}>{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
