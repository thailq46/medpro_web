import dynamic from "next/dynamic";
const Custom404 = dynamic(() => import("@/components/Layout/ErrorLayout/404"));
const DoctorBooking = dynamic(() => import("@/module/doctor-booking"));
const FacilityBooking = dynamic(() => import("@/module/facility-booking"));

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
