import dynamic from "next/dynamic";
const BookingAppointment = dynamic(
  () => import("@/module/booking-appointment")
);

export default function index() {
  return <BookingAppointment />;
}
