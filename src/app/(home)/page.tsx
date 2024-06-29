import dynamic from "next/dynamic";
const Home = dynamic(() => import("@/module/home"));

export default function Page() {
  return <Home />;
}
