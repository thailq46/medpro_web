import HomeAchievement from "@/module/home/_component/HomeAchievement";
import HomeBooking from "@/module/home/_component/HomeBooking";
import HomeDownload from "@/module/home/_component/HomeDownload";
import HomeHeader from "@/module/home/_component/HomeHeader";
import HomeHospital from "@/module/home/_component/HomeHospital";
import HomeNews from "@/module/home/_component/HomeNews";
import HomeSupport from "@/module/home/_component/HomeSupport";

export default async function Home({
  searchParams,
}: {
  searchParams?: {[key: string]: string | string[] | undefined};
}) {
  const searchKey = (searchParams?.search_key || "") as string;

  return (
    <div className="home-container">
      <HomeHeader searchKey={searchKey} />
      <HomeHospital />
      <HomeBooking />
      <HomeDownload />
      <HomeAchievement />
      <HomeNews />
      <HomeSupport />
    </div>
  );
}
