import {IGetHospitalRes} from "@/apiRequest/ApiHospital";
import dynamic from "next/dynamic";
const MedicalBookingForms = dynamic(
  () => import("@/module/medical-booking-forms"),
  {ssr: true}
);

export default async function Page({params}: {params: {slug: string}}) {
  const {slug} = params;
  let hospital: IGetHospitalRes["data"] | null = null;
  try {
    const apiHospital = (await import("@/apiRequest/ApiHospital")).default;
    const result = await apiHospital.getHospitalBySlug(slug);
    hospital = result?.payload?.data;
  } catch (error) {
    hospital = null;
    console.log("error Booking", error);
  }
  return <MedicalBookingForms hospital={hospital!} />;
}
