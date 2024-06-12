import apiAuthRequest from "@/apiRequest/ApiAuth";
import VerifyLayout from "@/components/Layout/VerifyLayout";

export default async function Page({
  params,
  searchParams,
}: {
  params: {slug: string};
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  const {slug} = params;
  if (slug === "verify-email") {
    const {token} = searchParams;
    let isError = false;
    try {
      await apiAuthRequest.verifyEmail(token as string);
    } catch (error) {
      isError = true;
      console.log(error);
    }
    return <VerifyLayout isError={isError} />;
  }
  return <div>{slug}</div>;
}
