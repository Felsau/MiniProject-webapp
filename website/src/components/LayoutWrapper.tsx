"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // ไม่ใส่ margin-left ในหน้า login และหน้า home
  if (pathname === "/" || pathname === "/login") {
    return <>{children}</>;
  }

  // ตรวจสอบว่ามี session และ role เป็น HR หรือ ADMIN หรือไม่
  const userRole = (session?.user as any)?.role;
  const showSidebar = status !== "loading" && session && (userRole === "HR" || userRole === "ADMIN");

  return (
    <main className={showSidebar ? "ml-72 min-h-screen" : "min-h-screen"}>
      {children}
    </main>
  );
}
