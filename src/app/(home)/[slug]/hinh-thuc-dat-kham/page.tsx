import {IGetHospitalRes} from "@/apiRequest/ApiHospital";
import dynamic from "next/dynamic";
const MedicalBookingForms = dynamic(
  () => import("@/module/medical-booking-forms")
);

export default async function Page({params}: {params: {slug: string}}) {
  const {slug} = params;
  let hospital: IGetHospitalRes["data"] | undefined = undefined;
  try {
    const apiHospital = (await import("@/apiRequest/ApiHospital")).default;
    const result = await apiHospital.getHospitalBySlug(slug);
    hospital = result?.payload?.data;
  } catch (error) {
    console.log("error Booking", error);
    // handleErrorApi({error});
  }
  return <MedicalBookingForms hospital={hospital!} />;
}
