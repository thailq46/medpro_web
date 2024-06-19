import Custom404 from "@/app/(home)/404/page";
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
      return <Custom404 />;
  }
}
