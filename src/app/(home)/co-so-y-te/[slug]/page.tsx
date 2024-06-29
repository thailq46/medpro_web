import dynamic from "next/dynamic";
const HealthFacilities = dynamic(() => import("@/module/health-facilities"));

export default function Page({params}: {params: {slug: string}}) {
  const {slug} = params;
  return <HealthFacilities slug={slug} />;
}
