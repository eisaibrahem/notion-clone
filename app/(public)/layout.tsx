import React from "react";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-full dark:bg-[#1f1f1f]">{children}</div>;
}

export default PublicLayout;
