"use client";

import { BonusIcon, StashIcon } from "@repo/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

const category = [
  { title: "Casino bonus", link: "/bonus/casinobonus", icon: BonusIcon },
  { title: "Bonus History", link: "/bonus/history", icon: StashIcon },
];

export default function BonusButtons() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      {category.map((item) => {
        return (
          <Link
            href={item.link}
            className={`flex flex-row gap-2 items-center justify-center sm:text-base xs:text-sm text-xs w-full text-center ${pathname.split("/").at(-1) === item.link.split("/").at(-1) ? "bg-main" : "bg-main/20"} sm:px-7 px-5 py-2 rounded cursor-pointer`}
            key={item.title}
            role="button"
          >
            <item.icon className="w-5 h-5" />

            {item.title}
          </Link>
        );
      })}
    </div>
  );
}
