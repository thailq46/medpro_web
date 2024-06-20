"use client";
import {ISpecialtyBody} from "@/apiRequest/ApiSpecialty";
import {STEP_NAME} from "@/apiRequest/common";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import useDebounce from "@/hooks/useDebounce";
import Link from "next/link";
import {useEffect, useState} from "react";
import styles from "./BookingAppointment.module.scss";

interface IChooseSubjectProps {
  feature: string;
  hospitalId: string;
  stepName: string;
  specialty: ISpecialtyBody[];
  isLoading: boolean;
  onSearchSpecialty: (search: string) => void;
}

export default function ChooseSubject({
  feature,
  hospitalId,
  specialty,
  isLoading,
  onSearchSpecialty,
}: IChooseSubjectProps) {
  const [searchSpecialty, setSearchSpecialty] = useState<string>("");
  const filterDebounce = useDebounce(searchSpecialty, 500);

  useEffect(() => {
    onSearchSpecialty(filterDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDebounce]);

  return (
    <div className={styles.rightBody}>
      <div className={styles.search}>
        <Input
          placeholder="Tìm nhanh chuyên khoa"
          onChange={(e) => setSearchSpecialty(e.target.value)}
        />
      </div>
      {isLoading ? (
        <>
          <Skeleton className="w-[25%] h-10" />
          <Skeleton className="w-full h-10 mt-1" />
          <Skeleton className="w-full h-10 mt-1" />
          <Skeleton className="w-full h-10 mt-1" />
        </>
      ) : (
        <ul className={styles.listSubject}>
          {!!specialty.length ? (
            specialty.map((v) => (
              <li key={v._id} className={styles.subjectItem}>
                <Link
                  href={{
                    pathname: "/chon-lich-kham",
                    query: {
                      feature,
                      hospitalId,
                      stepName: STEP_NAME.DOCTOR,
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
            ))
          ) : (
            <p className="text-center p-10 text-xl text-textSecondary font-bold">
              Không tìm thấy chuyên khoa
            </p>
          )}
        </ul>
      )}
    </div>
  );
}
