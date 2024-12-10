"use client";

import { buttonVariants } from "@repo/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TabsArr = [
  { title: "In Play", href: "in-play" },
  { title: "All Match", href: "all" },
];

export default function Tabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2">
      {TabsArr.map((item) => (
        <Link
          href={item.href}
          key={item.title}
          className={`${buttonVariants({ variant: `${pathname.includes(item.href) ? "default" : "outline"}` })}`}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}
