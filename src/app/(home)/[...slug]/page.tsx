export default function Page({params}: {params: {slug: string}}) {
  console.log("params", params);
  const {slug} = params;
  return null;
}
