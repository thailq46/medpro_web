import apiCategoryRequest from "@/apiRequest/ApiCategory";
import {CATE, QUERY_PARAMS} from "@/apiRequest/common";
import {generateDescription} from "@/lib/utils";
import {Metadata} from "next";
import dynamic from "next/dynamic";
import {cache} from "react";
const HealthFacilities = dynamic(() => import("@/module/health-facilities"));

type Props = {
  params: {slug: string};
  searchParams: {[key: string]: string | string[] | undefined};
};

const getListCategory = cache(apiCategoryRequest.getListCategory);

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = params;
  const {payload} = await getListCategory(QUERY_PARAMS);
  const categories = payload?.data;
  const parentCategory = categories?.find((cate) => cate.slug === CATE.CSYT);
  const typeOfHospitals = categories?.filter(
    (v) => v.parent_id === parentCategory?._id
  );
  const isActived = typeOfHospitals?.find((v) => v.slug === slug);
  const metadata = isActived?.name + ` - ${generateDescription(slug).metadata}`;
  if (categories) {
    return {
      category: "Danh sách cơ sở y tế",
      title: metadata,
      description: metadata,
    };
  }
  return {};
}

export default function Page({params}: {params: {slug: string}}) {
  const {slug} = params;
  return <HealthFacilities slug={slug} />;
}
