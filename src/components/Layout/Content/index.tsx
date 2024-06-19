import React from "react";

export default function Content({children}: {children: React.ReactNode}) {
  return <main className="pt-[65px]">{children}</main>;
}
