import {AT_COOKIE_NAME} from "@/apiRequest/common";
import Login from "@/module/login";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export default function index() {
  const cookieStorage = cookies();
  const isLogin = Boolean(cookieStorage.get(AT_COOKIE_NAME));
  if (isLogin) {
    redirect("/");
  }
  return <Login />;
}
