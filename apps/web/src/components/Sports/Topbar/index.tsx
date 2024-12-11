"use client";

import { buttonVariants } from "@repo/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Links = [
  { title: "In Play", href: "/sports/inplay" },
  { title: "Cricket", href: "/sports/cricket" },
  { title: "Tennis", href: "/sports/tennis" },
  { title: "Football", href: "/sports/football" },
];

export default function TopBar() {
  const pathname = usePathname();

  if (pathname.includes("match")) {
    return null;
  }

  return (
    <div className="flex border rounded-md border-white/20 p-1">
      {Links.map((item) => (
        <Link
          href={`${item.href}`}
          key={item.title}
          className={buttonVariants({
            variant: `${pathname.includes(item.href) ? "yellow" : "main"}`,
            size: "sm",
            className: "w-full",
          })}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}
