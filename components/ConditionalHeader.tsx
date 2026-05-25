"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

const HIDE_ON_PREFIXES = ["/dashboard", "/login", "/register", "/verify-email", "/auth"];

export default function ConditionalHeader() {
  const pathname = usePathname();
  const hidden = HIDE_ON_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (hidden) return null;
  return <Header />;
}
