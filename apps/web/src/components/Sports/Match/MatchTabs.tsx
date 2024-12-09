"use client";

import { buttonVariants } from "@repo/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TabsArr = [
  { title: "All", value: "all" },
  { title: "Market", value: "market" },
  { title: "Fancy", value: "fancy" },
  { title: "Only Over", value: "onlyover" },
  { title: "Player Run", value: "playerrun" },
  { title: "Boundaries", value: "boundaries" },
  { title: "Wicket", value: "wicket" },
];

export default function MatchTabs() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-5 justify-around bg-inputField rounded-md p-1 overflow-x-auto">
      {TabsArr.map((item) => (
        <Link
          href={`${item.value}`}
          key={item.title}
          className={buttonVariants({
            variant: `${pathname.includes(item.value) ? "yellow" : "main"}`,
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
