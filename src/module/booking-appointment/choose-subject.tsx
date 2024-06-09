"use client";
import apiSpecialty, {ISpecialtyBody} from "@/apiRequest/ApiSpecialty";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import useDebounce from "@/hooks/useDebounce";
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";
import {useEffect, useState} from "react";
import styles from "./BookingAppointment.module.scss";

interface IChooseSubjectProps {
  feature: string;
  hospitalId: string;
  stepName: string;
  onChooseSpecialty: (value: ISpecialtyBody[]) => void;
}

export default function ChooseSubject({
  feature,
  hospitalId,
  onChooseSpecialty,
}: IChooseSubjectProps) {
  const [searchSpecialty, setSearchSpecialty] = useState<string>("");
  const filterDebounce = useDebounce(searchSpecialty, 500);

  const {data: specialty, isLoading} = useQuery({
    queryKey: [
      QUERY_KEY.GET_SPECIALTY_BY_HOSPITAL_ID,
      {hospitalId: hospitalId, params: {search: filterDebounce}},
    ],
    queryFn: () =>
      apiSpecialty.getListSpecialtyByHospitalId({
        hospitalId: hospitalId ?? "",
        params: {search: filterDebounce},
      }),
    enabled: !!hospitalId,
  });

  useEffect(() => {
    if (specialty?.payload?.data) {
      onChooseSpecialty(specialty.payload.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialty?.payload.data]);

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
          {!!specialty?.payload?.data.length ? (
            specialty?.payload?.data.map((v) => (
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
