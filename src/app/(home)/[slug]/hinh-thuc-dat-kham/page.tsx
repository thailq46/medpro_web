import apiHospital, {IGetHospitalRes} from "@/apiRequest/ApiHospital";
import MedicalBookingForms from "@/module/medical-booking-forms";

export default async function Page({params}: {params: {slug: string}}) {
  const {slug} = params;
  let hospital: IGetHospitalRes["data"] | undefined = undefined;
  try {
    const result = await apiHospital.getHospitalBySlug(slug);
    hospital = result?.payload?.data;
  } catch (error) {
    console.log("error Booking", error);
    // handleErrorApi({error});
  }
  return <MedicalBookingForms hospital={hospital!} />;
}
