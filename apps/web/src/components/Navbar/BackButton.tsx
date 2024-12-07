"use client";

import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BackButton() {
  const pathname = usePathname();

  if (pathname.startsWith("/casino/game/")) {
    return <ArrowLeft className="w-4 h-4 sm:hidden" />;
  }
}
