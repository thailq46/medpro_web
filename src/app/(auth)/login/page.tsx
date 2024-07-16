import dynamic from "next/dynamic";
const Login = dynamic(() => import("@/module/login"));

export type PropsLogin = {
  params: {slug: string};
  searchParams: {[key: string]: string | string[] | undefined};
};

export default function index({params, searchParams}: PropsLogin) {
  return <Login params={params} searchParams={searchParams} />;
}
