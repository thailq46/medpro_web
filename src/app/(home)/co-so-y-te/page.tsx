import dynamic from "next/dynamic";
const HealthFacilities = dynamic(() => import("@/module/health-facilities"));

export default function index() {
  return <HealthFacilities />;
}
