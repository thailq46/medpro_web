"use client";
import {ISpecialtyBody} from "@/apiRequest/ApiSpecialty";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import styles from "./BookingAppointment.module.scss";

interface IChooseSubjectProps {
  feature: string;
  hospitalId: string;
  stepName: string;
  specialty: ISpecialtyBody[];
}

export default function ChooseSubject({
  feature,
  hospitalId,
  specialty,
}: IChooseSubjectProps) {
  return (
    <div className={styles.rightBody}>
      <div className={styles.search}>
        <Input placeholder="Tìm nhanh chuyên khoa" />
      </div>
      <ul className={styles.listSubject}>
        {specialty.map((v) => (
          <li key={v._id} className={styles.subjectItem}>
            <Link
              href={{
                pathname: "/chon-lich-kham",
                query: {
                  feature,
                  hospitalId,
                  stepName: "doctor",
                  specialtyId: v._id,
                },
              }}
            >
              <span className={styles.itemName}>{v.name}</span>
              {v.description && v.description !== "null" && (
                <span className={styles.itemNote}>({v.description})</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
