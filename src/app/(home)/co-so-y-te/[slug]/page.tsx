import HealthFacilities from "@/module/health-facilities";

export default function Page({params}: {params: {slug: string}}) {
  const {slug} = params;
  return <HealthFacilities slug={slug} />;
}
