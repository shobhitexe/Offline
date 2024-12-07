import { DocumentIcon } from "@repo/ui";
import { DashboardHeading } from "@/components";
import Image from "next/image";

const profileLinks = [
  {
    title: "Referrals",
    href: "/dashboard/referral",
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-5 pb-10 w-[90%] mx-auto">
      <DashboardHeading heading="Refer & Earn" />
      {/* <div className="text-center max-w-sm md:text-base text-sm">
        Earn rewards together with your friends via Spot, Derivatives, Copy
        Trading and Bybit Card
      </div> */}

      {/* <div className="flex items-end justify-center md:gap-20 gap-10 w-full relative sm:-top-10 -top-5">
        <div className="text-yellow md:text-5xl sm:text-4xl ss:text-2xl xs:text-xl text-lg leading-tight">
          Invite friends to play and Earn <br />
          Unlimited Referral Bonus.
        </div>
        <Image
          src={"/images/referral/referral.png"}
          alt={"refer"}
          width={200}
          height={200}
          className="sm:w-[200px] xs:w-[150px] w-[100px]"
        />
      </div> */}
      {children}
    </div>
  );
}
