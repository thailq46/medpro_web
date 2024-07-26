import Login from "@/module/login";

export type PropsLogin = {
  params: {slug: string};
  searchParams: {[key: string]: string | string[] | undefined};
};

export default function index({searchParams}: PropsLogin) {
  return <Login searchParams={searchParams} />;
}
