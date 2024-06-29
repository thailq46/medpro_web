import dynamic from "next/dynamic";
const Register = dynamic(() => import("@/module/register"));

export default function page() {
  return <Register />;
}
