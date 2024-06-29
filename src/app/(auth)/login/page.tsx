import {AT_COOKIE_NAME} from "@/apiRequest/common";
import dynamic from "next/dynamic";
import {cookies} from "next/headers";
const Login = dynamic(() => import("@/module/login"));

export default async function index() {
  const cookieStorage = cookies();
  const isLogin = Boolean(cookieStorage.get(AT_COOKIE_NAME));
  if (isLogin) {
    const {redirect} = await import("next/navigation");
    redirect("/");
  }
  return <Login />;
}
