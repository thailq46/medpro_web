import HealthFacilities from "@/module/health-facilities";

export default function Page({params}: {params: {slug: string}}) {
  console.log("params", params);
  const {slug} = params;
  return <HealthFacilities slug={slug} />;
}
