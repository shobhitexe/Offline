import Image from "next/image";
import { buttonVariants } from "@repo/ui";
import Link from "next/link";
// import LoginModal from "../Auth/LoginModal";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import ProviderSelect from "./ProviderSelect";
import NavDropDown from "./NavDropDown";
import NavSearch from "./NavSerach";
import NavWallet from "./NavWallet";
import BackButton from "./BackButton";
import { logoMap } from "@/lib/constants/logomap";
import { chatSupportEnabled } from "@/lib/constants/config";

export default async function Navbar() {
  const session = await getServerSession(options);

  const sizeMap = {
    offline: "sm:w-[100px] w-[65px] relative",
  };

  const casinoName = (
    process.env.NEXT_PUBLIC_CASINO_NAME as string
  ).toLowerCase();
  return (
    <nav className="flex flex-col items-center justify-between sm:px-5 px-2 py-3 fixed w-full bg-main/90 deltinstars:bg-main z-20">
      <div className="pointer-events-none absolute inset-0  z-[1] h-[17vh] backdrop-blur-[0.0625px] [mask-image:linear-gradient(0deg,transparent_0%,#000_12.5%,#000_25%,transparent_37.5%)]"></div>
      <div className="pointer-events-none absolute inset-0  z-[2] h-[17vh] backdrop-blur-[0.125px] [mask-image:linear-gradient(0deg,transparent_12.5%,#000_25%,#000_37.5%,transparent_50%)]"></div>
      <div className="pointer-events-none absolute inset-0  z-[3] h-[17vh] backdrop-blur-[0.25px] [mask-image:linear-gradient(0deg,transparent_25%,#000_37.5%,#000_50%,transparent_62.5%)]"></div>
      <div className="pointer-events-none absolute inset-0  z-[4] h-[17vh] backdrop-blur-[0.5px] [mask-image:linear-gradient(0deg,transparent_37.5%,#000_50%,#000_62.5%,transparent_75%)]"></div>
      <div className="pointer-events-none absolute inset-0  z-[5] h-[17vh] backdrop-blur-[1px] [mask-image:linear-gradient(0deg,transparent_50%,#000_62.5%,#000_75%,transparent_87.5%)]"></div>
      <div className="pointer-events-none absolute inset-0  z-[6] h-[17vh] backdrop-blur-[2px] [mask-image:linear-gradient(0deg,transparent_62.5%,#000_75%,#000_87.5%,transparent_100%)]"></div>
      <div className="pointer-events-none absolute inset-0  z-[7] h-[17vh] backdrop-blur-[4px] [mask-image:linear-gradient(0deg,transparent_75%,#000_87.5%,#000_100%,transparent_112.5%)]"></div>

      <div className="flex items-center justify-between w-full md:px-5s z-10">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2">
            <BackButton />
            <Image
              alt="Logo"
              className={
                sizeMap[casinoName as keyof typeof sizeMap] || sizeMap.offline
              }
              height={80}
              src={
                logoMap[casinoName as keyof typeof logoMap] || logoMap.fallback
              }
              width={100}
            />
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <NavSearch position="navbar" />
          {session?.user.id ? (
            <div className="flex items-center md:gap-10 gap-2">
              <div className="flex items-center gap-5">
                <div className="sm:flex hidden">
                  {" "}
                  <Link
                    href={
                      chatSupportEnabled.includes(
                        process.env.NEXT_PUBLIC_CASINO_NAME as string
                      )
                        ? `javascript:void(Tawk_API.toggle())`
                        : `https://wa.me/+91${process.env.NEXT_PUBLIC_SUPPORT_NUMBER}`
                    }
                    target={
                      chatSupportEnabled.includes(
                        process.env.NEXT_PUBLIC_CASINO_NAME as string
                      )
                        ? "_self"
                        : "_blank"
                    }
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded-lg flex items-center gap-2"
                  >
                    <SupportIcon />
                    <div className="text-sm text-white">Support</div>
                  </Link>
                </div>
                <Link
                  href={"/bonus/casinobonus"}
                  className="items-center gap-2 sm:flex hidden cursor-pointer"
                >
                  <Image
                    src={"/images/navbar/bonus.png"}
                    alt={"promotion"}
                    width={24}
                    height={24}
                  />
                  <div className="text-sm">Bonus</div>
                </Link>
                <div className="sm:flex hidden">
                  {" "}
                  <Link href="/sports" className="px-2 py-1 rounded-lg">
                    <div className="flex items-center gap-2">
                      <SportsIcon />
                      <div className="text-sm text-white">Sports</div>
                    </div>
                  </Link>
                </div>{" "}
              </div>

              <div className="cursor-pointer hidden">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.3124 22.8529C11.5632 22.8529 12.5865 21.8296 12.5865 20.5788H8.03831C8.03831 21.8296 9.06166 22.8529 10.3124 22.8529ZM17.7033 16.0306V9.77678C17.7033 6.25191 15.3155 3.40927 12.018 2.61334V1.8174C12.018 0.907754 11.2221 0.111816 10.3124 0.111816C9.40278 0.111816 8.60684 0.907754 8.60684 1.8174V2.61334C5.30938 3.40927 2.92157 6.25191 2.92157 9.77678V16.0306L0.647461 18.3047V19.4417H19.9774V18.3047L17.7033 16.0306Z"
                    fill="white"
                  />
                </svg>
              </div>

              <NavWallet />

              <div className="sm:flex hidden">
                <NavDropDown />
              </div>
            </div>
          ) : (
            <div className="flex items-center sm:gap-3 gap-2">
              {/* <LoginModal /> */}

              <div className="sm:flex hidden">
                {" "}
                <Link
                  href={
                    chatSupportEnabled.includes(
                      process.env.NEXT_PUBLIC_CASINO_NAME as string
                    )
                      ? `javascript:void(Tawk_API.toggle())`
                      : `https://wa.me/+91${process.env.NEXT_PUBLIC_SUPPORT_NUMBER}`
                  }
                  target={
                    chatSupportEnabled.includes(
                      process.env.NEXT_PUBLIC_CASINO_NAME as string
                    )
                      ? "_self"
                      : "_blank"
                  }
                  // rel="noopener noreferrer"
                  className="px-2 py-1 rounded-lg flex items-center gap-2"
                >
                  <SupportIcon />
                  <div className="text-sm text-white">Support</div>
                </Link>
              </div>

              <Link
                href="/auth/login"
                className={buttonVariants({
                  variant: "secondary",
                  size: "sm",
                  className: "sm:text-base text-xs ui-font-semibold",
                })}
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function SportsIcon() {
  return (
    <svg
      width="24"
      height="24"
      fill="#ffffff"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>sports-basketball-solid</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="invisible_box" data-name="invisible box">
          <rect width="48" height="48" fill="none" />
        </g>
        <g id="Q3_icons" data-name="Q3 icons">
          <g>
            <path d="M3.9,15.1A21.4,21.4,0,0,0,2.4,27.9l10.9-2.5A16.1,16.1,0,0,0,3.9,15.1Z" />
            <path d="M13.9,28.3,3.1,30.8a22.4,22.4,0,0,0,6.7,10A16,16,0,0,0,14,30,9.7,9.7,0,0,0,13.9,28.3Z" />
            <path d="M16.2,24.7l6.1-1.3L17.7,2.9A21.8,21.8,0,0,0,5.3,12.4,18.8,18.8,0,0,1,16.2,24.7Z" />
            <path d="M16.8,27.7A8.6,8.6,0,0,1,17,30a19,19,0,0,1-4.8,12.6,21.7,21.7,0,0,0,15.2,3.1L23,26.3Z" />
            <path d="M31.3,21.3A18.4,18.4,0,0,1,31,18,19,19,0,0,1,35.8,5.4,21.7,21.7,0,0,0,20.6,2.3l4.6,20.4Z" />
            <path d="M34.2,20.6l11-2.4a21.6,21.6,0,0,0-7-11A16,16,0,0,0,34,18,21.1,21.1,0,0,0,34.2,20.6Z" />
            <path d="M32,24.2l-6.1,1.4,4.4,19.5a21.8,21.8,0,0,0,12.4-9.5A19.4,19.4,0,0,1,32,24.2Z" />
            <path d="M45.8,21.1,35,23.6a16.3,16.3,0,0,0,9.1,9.3A21.5,21.5,0,0,0,45.8,21.1Z" />
          </g>
        </g>
      </g>
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M5 7.5C5 4.73828 7.23828 2.5 10 2.5C12.7617 2.5 15 4.73828 15 7.5C15 8.04297 14.9141 8.56641 14.7539 9.05469C14.4297 9.62109 13.8203 10 13.125 10H12.7891C12.3555 9.25391 11.5508 8.75 10.625 8.75H9.375C7.99609 8.75 6.875 9.87109 6.875 11.25C6.875 11.3047 6.875 11.3555 6.87891 11.4062C5.73438 10.4922 5 9.08203 5 7.5Z"
        fill="white"
      />
      <path
        d="M10 1.25C6.54688 1.25 3.75 4.04688 3.75 7.5V8.125C3.75 8.46875 3.46875 8.75 3.125 8.75C2.78125 8.75 2.5 8.46875 2.5 8.125V7.5C2.5 3.35938 5.85938 0 10 0C14.1406 0 17.5 3.35938 17.5 7.5V8.125C17.5 10.543 15.543 12.5 13.125 12.5H10.625H10H9.375C8.68359 12.5 8.125 11.9414 8.125 11.25C8.125 10.5586 8.68359 10 9.375 10H10.625C11.3164 10 11.875 10.5586 11.875 11.25H13.125C14.8516 11.25 16.25 9.85156 16.25 8.125V7.5C16.25 4.04688 13.4531 1.25 10 1.25ZM6.5 13.75H13.5C16.3984 13.75 18.75 16.1016 18.75 19C18.75 19.5508 18.3008 20 17.75 20H2.25C1.69922 20 1.25 19.5508 1.25 19C1.25 16.1016 3.60156 13.75 6.5 13.75Z"
        fill="white"
      />
    </svg>
  );
}
