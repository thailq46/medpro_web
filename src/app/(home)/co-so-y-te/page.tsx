import {Metadata} from "next";
import dynamic from "next/dynamic";
const HealthFacilities = dynamic(() => import("@/module/health-facilities"));

export const metadata: Metadata = {
  title: "Danh sách cơ sở y tế ",
  description:
    "Danh sách các loại bệnh viện - cơ sở y tế. Được tạo bởi Lê Quang Thái",
};

export default function index() {
  return <HealthFacilities />;
}
