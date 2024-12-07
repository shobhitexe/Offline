import { LinkComponent } from "@repo/ui";
import Image from "next/image";
import Link from "next/link";

const FooterArr = [
  {
    heading: "Solutions",
    links: [
      {
        title: "Dispute Resolution",
        link: "/documents/solutions/disputeresolution",
      },
      { title: "Fairness", link: "/documents/solutions/fairness" },
      { title: "Payout", link: "/documents/solutions/payout" },
      { title: "Registration", link: "/documents/solutions/registration" },
    ],
  },
  {
    heading: "Support",
    links: [
      { title: "KYC", link: "/documents/support/kyc" },
      {
        title: "Responsible Gambling",
        link: "/documents/support/responsiblegaming",
      },
      { title: "Self Exclusion", link: "/documents/support/selfexclusion" },
      { title: "Guides", link: "" },
    ],
  },
  {
    heading: "Company",
    links: [
      { title: "About Us", link: "/about-us" },
      { title: "Contact Us", link: "" },
      { title: "Jobs", link: "" },
      { title: "Partners", link: "" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { title: "Claim", link: "" },
      { title: "Privacy", link: "/documents/legal/privacy" },
      { title: "Terms", link: "/documents/legal/termsofservice" },
      { title: "Anti Money", link: "/documents/legal/antimoneylaundering" },
    ],
  },
];

export default function Footer(): JSX.Element {
  const casinoName = (
    process.env.NEXT_PUBLIC_CASINO_NAME as string
  ).toLowerCase();

  return (
    <div className="bg-main py-10 px-5 flex flex-col gap-5">
      <div className="sm:flex grid grid-cols-2 items-start sm:justify-around justify-start sm:flex-wrap sm:gap-10 gap-5">
        {FooterArr.map((footer) => {
          return (
            <div className="flex flex-col gap-3" key={footer.heading}>
              <div className="sm:text-lg text-base">{footer.heading}</div>
              <div className="flex flex-col gap-3">
                {footer.links.map((link) => {
                  return (
                    <LinkComponent
                      className="text-[#9CA3B0] sm:text-base text-sm"
                      href={link.link}
                      key={link.title}
                      linkComponent={Link}
                    >
                      {link.title}
                    </LinkComponent>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="sm:grid hidden sm:grid-cols-2 grid-cols-3 gap-5">
          {["f1.png", "f2.png", "f3.png"].map((item) => (
            <Image
              alt="logos"
              key={item}
              height={130}
              src={`/images/footer/${item}`}
              width={130}
              className="sm:w-[130px] w-[200px]"
            />
          ))}

          {casinoName === "jackpot1x" && (
            <Image
              alt="logos"
              height={130}
              src={`/images/footer/f4.webp`}
              width={130}
              className="sm:w-[130px] w-[200px]"
            />
          )}
        </div>

        {/* <Image
          alt="logos"
          height={200}
          src="/images/footer/logos.webp"
          width={300}
        /> */}
      </div>

      <div className="sm:hidden grid sm:grid-cols-2 grid-cols-3 gap-5 items-center">
        {["f1.png", "f2.png", "f3.png"].map((item) => (
          <Image
            alt="logos"
            key={item}
            height={130}
            src={`/images/footer/${item}`}
            width={130}
            className="sm:w-[130px] w-[200px]"
          />
        ))}

        {casinoName === "jackpot1x" && (
          <Image
            alt="logos"
            height={130}
            src={`/images/footer/f4.webp`}
            width={130}
            className="sm:w-[130px] w-[200px]"
          />
        )}
      </div>

      <Divider className="mt-10" />

      <p className="text-[#9CA3B0] sm:w-[95%] w-full mx-auto sm:text-base text-sm">
        In order to register for this website, the user is required to accept
        the{" "}
        <LinkComponent
          className="text-white underline"
          href=""
          linkComponent={Link}
        >
          General Terms and Conditions.
        </LinkComponent>
        In the event the General Terms and Conditions are updated,existing users
        may choose to discontinue using the products and services before the
        said update shall become effective, which is a minimum of two weeks
        after it has been announced.
      </p>
      <Divider />
      <p className="text-[#9CA3B0] sm:w-[95%] w-full mx-auto sm:text-base text-sm">
        Copyright © 2024{" "}
        <span className="text-white font-medium">
          {process.env.NEXT_PUBLIC_CASINO_NAME}
        </span>{" "}
        | All rights reserved.
      </p>
    </div>
  );
}

function Divider({ className }: { className?: string }): JSX.Element {
  return (
    <div
      className={`sm:w-[95%] w-full mx-auto h-[2px] bg-[#E5E7EB66] ${className}`}
    />
  );
}
