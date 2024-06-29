import dynamic from "next/dynamic";
const Login = dynamic(() => import("@/module/login"));

export default function index() {
  return <Login />;
}
