"use client";

import { buttonVariants } from "@repo/ui";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Links = [
  { title: "In Play", href: "/sports/inplay", icon: "/images/sports/live.svg" },
  {
    title: "Cricket",
    href: "/sports/cricket",
    icon: "/images/sports/cricket.svg",
  },
  {
    title: "Tennis",
    href: "/sports/tennis",
    icon: "/images/sports/tennis.svg",
  },
  {
    title: "Football",
    href: "/sports/football",
    icon: "/images/sports/football.svg",
  },
];

export default function TopBar() {
  const pathname = usePathname();

  if (pathname.includes("match")) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <Image
        src={"/images/sports/sports-banner.png"}
        alt={"banner"}
        width={1498}
        height={301}
        className="w-full"
      />

      <div className="flex rounded-md justify-start gap-7 p-1 border-b border-inputField w-full overflow-x-auto sm:mt-2">
        {Links.map((item) => (
          <Link
            href={`${item.href}`}
            key={item.title}
            className={`flex flex-col text-main items-center justify-center gap-2 relative`}
          >
            <div
              className={`${pathname.includes(item.href) && "border-b-2 border-red-500"} absolute w-full -bottom-1`}
            />

            <Image src={item.icon} alt={item.title} width={30} height={30} />
            <div className="text-xs uppercase font-semibold whitespace-nowrap">
              {item.title}
            </div>
          </Link>
        ))}

        <Link
          aria-disabled
          href={`/sports/inplay`}
          className={`flex flex-col text-main items-center justify-center gap-2 relative`}
        >
          <Image
            src={"/images/sports/politics.svg"}
            alt={"politics"}
            width={30}
            height={30}
          />
          <div className="text-xs uppercase font-semibold whitespace-nowrap">
            Politics
          </div>
        </Link>
      </div>
    </div>
  );
}
