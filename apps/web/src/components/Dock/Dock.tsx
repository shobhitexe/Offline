"use client";

import Image from "next/image";
import Link from "next/link";
import MobileSidebar from "../Dashboard/Sidebar/MobileSidebar";
import { usePathname } from "next/navigation";
import { chatSupportEnabled } from "@/lib/constants/config";

const DockOptions = [
  {
    title: "Casino",
    image: "/images/dock/casino.svg",
    link: "/",
    target: "_self",
  },
  {
    title: "Wallet",
    image: "/images/dock/wallet.svg",
    link: "/dashboard/wallet/deposit",
    target: "_self",
  },
  {
    title: "Offers",
    image: "/images/dock/offers.svg",
    link: "/bonus/casinobonus",
    target: "_self",
  },
  {
    title: "Support",
    image:
      process.env.NEXT_PUBLIC_CASINO_NAME === "Pridegains"
        ? "/images/dock/whatsapp.svg"
        : "/images/dock/support.svg",
    link: chatSupportEnabled.includes(
      process.env.NEXT_PUBLIC_CASINO_NAME as string
    )
      ? `javascript:void(Tawk_API.toggle())`
      : `https://wa.me/+91${process.env.NEXT_PUBLIC_SUPPORT_NUMBER}`,
    target: chatSupportEnabled.includes(
      process.env.NEXT_PUBLIC_CASINO_NAME as string
    )
      ? "_self"
      : "_blank",
  },
];

export default function Dock() {
  const pathname = usePathname();

  if (pathname.startsWith("/casino/game/")) {
    return <></>;
  }

  return (
    <div
      className={`sm:hidden flex fixed z-20 bottom-0 left-0 w-full items-end justify-around py-2 bg-main/90 deltinstars:bg-main`}
    >
      {DockOptions.map((item, idx) => (
        <Link
          key={item.title}
          href={item.link}
          target={item.target}
          className={`z-10 flex flex-col items-center justify-center gap-1 ${pathname === item.link && "border-b"}`}
        >
          {process.env.NEXT_PUBLIC_CASINO_NAME === "Pridegains" ? (
            <Image
              src={item.image}
              alt={item.title}
              width={idx === 1 || idx === 3 ? 26 : 25}
              height={idx === 1 || idx === 3 ? 26 : 25}
            />
          ) : (
            <Image
              src={item.image}
              alt={item.title}
              width={idx === 1 || idx === 3 ? 30 : 25}
              height={idx === 1 || idx === 3 ? 30 : 25}
            />
          )}

          <div className="text-white text-xs font-medium">{item.title}</div>
        </Link>
      ))}

      <MobileSidebar />

      <div className="pointer-events-none absolute inset-0  z-[1] h-[20vh] backdrop-blur-[0.0625px] [mask-image:linear-gradient(0deg,transparent_0%,#000_12.5%,#000_25%,transparent_37.5%)]"></div>
      <div className="pointer-events-none absolute inset-0  z-[2] h-[20vh] backdrop-blur-[0.125px] [mask-image:linear-gradient(0deg,transparent_12.5%,#000_25%,#000_37.5%,transparent_50%)]"></div>
      <div className="pointer-events-none absolute inset-0  z-[3] h-[20vh] backdrop-blur-[0.25px] [mask-image:linear-gradient(0deg,transparent_25%,#000_37.5%,#000_50%,transparent_62.5%)]"></div>
      <div className="pointer-events-none absolute inset-0  z-[4] h-[20vh] backdrop-blur-[0.5px] [mask-image:linear-gradient(0deg,transparent_37.5%,#000_50%,#000_62.5%,transparent_75%)]"></div>
      <div className="pointer-events-none absolute inset-0  z-[5] h-[20vh] backdrop-blur-[1px] [mask-image:linear-gradient(0deg,transparent_50%,#000_62.5%,#000_75%,transparent_87.5%)]"></div>
      <div className="pointer-events-none absolute inset-0  z-[6] h-[20vh] backdrop-blur-[2px] [mask-image:linear-gradient(0deg,transparent_62.5%,#000_75%,#000_87.5%,transparent_100%)]"></div>
      <div className="pointer-events-none absolute inset-0  z-[7] h-[20vh] backdrop-blur-[4px] [mask-image:linear-gradient(0deg,transparent_75%,#000_87.5%,#000_100%,transparent_112.5%)]"></div>
    </div>
  );
}
