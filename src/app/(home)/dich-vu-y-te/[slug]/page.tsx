import DoctorBooking from "@/module/doctor-booking";
import FacilityBooking from "@/module/facility-booking";

export default function Page({params}: {params: {slug: string}}) {
  const {slug} = params;
  switch (slug) {
    case "dat-kham-tai-co-so":
      return <FacilityBooking />;
    case "dat-kham-theo-bac-si":
      return <DoctorBooking />;
    default:
      break;
  }
  return <h1>{slug}</h1>;
}
