"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "./SiteFooter";

const HIDE_ON_PREFIXES = ["/dashboard", "/login", "/register", "/verify-email", "/auth"];

export default function ConditionalFooter() {
  const pathname = usePathname();
  // Homepage has its own full footer; dashboard/auth routes have no footer
  if (pathname === "/" || HIDE_ON_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  return <SiteFooter />;
}
