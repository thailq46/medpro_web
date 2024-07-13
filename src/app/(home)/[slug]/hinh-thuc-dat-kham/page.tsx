import apiHospital, {IGetHospitalRes} from "@/apiRequest/ApiHospital";
import {Metadata} from "next";
import dynamic from "next/dynamic";
import {cache} from "react";
const MedicalBookingForms = dynamic(
  () => import("@/module/medical-booking-forms"),
  {ssr: true}
);

type Props = {
  params: {slug: string};
  searchParams: {[key: string]: string | string[] | undefined};
};

const getHospitalBySlug = cache(apiHospital.getHospitalBySlug);

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = params;
  const {payload} = await getHospitalBySlug(slug);
  const hospital = payload?.data;
  if (hospital) {
    return {
      category: "Hình thức đặt khám",
      title: "Hình thức đặt khám - " + hospital.name,
      description: `${hospital.description} - ${hospital.address}`,
    };
  }
  return {};
}

export default async function Page({params}: Props) {
  const {slug} = params;
  let hospital: IGetHospitalRes["data"] | null = null;
  try {
    const result = await getHospitalBySlug(slug);
    hospital = result?.payload?.data;
  } catch (error) {
    hospital = null;
    console.log("error Booking", error);
  }
  return <MedicalBookingForms hospital={hospital!} />;
}
