import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
import {
  Dock,
  Footer,
  Navbar,
  ProviderSelect,
  ThemeToggles,
} from "../components";
import { SessionProviders, StoreProviders, ThemeProviders } from "./providers";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import { Toaster } from "@repo/ui";
import { Poppins } from "next/font/google";

import { chatSupportEnabled, metadataMap } from "@/lib/constants/config";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500"],
});

export const metadata: Metadata = {
  title: metadataMap[process.env.NEXT_PUBLIC_CASINO_NAME as string].title || "",
  description:
    metadataMap[process.env.NEXT_PUBLIC_CASINO_NAME as string].desc || "",
};

const ThemeArr: Record<string, string> = {
  Offline: "bg-[#040B1B]",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);

  const casinoName = (
    process.env.NEXT_PUBLIC_CASINO_NAME as string
  ).toLowerCase();

  return (
    <html
      lang="en"
      data-theme={`${(process.env.NEXT_PUBLIC_CASINO_NAME as string).toLowerCase()}`}
      // className={`${ThemeArr[process.env.NEXT_PUBLIC_CASINO_NAME as string]}`}
      className={poppins.className}
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href={`/favicon/${casinoName}/apple-icon-57x57.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href={`/favicon/${casinoName}/apple-icon-60x60.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href={`/favicon/${casinoName}/apple-icon-72x72.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`/favicon/${casinoName}/apple-icon-76x76.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href={`/favicon/${casinoName}/apple-icon-114x114.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href={`/favicon/${casinoName}/apple-icon-120x120.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href={`/favicon/${casinoName}/apple-icon-144x144.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href={`/favicon/${casinoName}/apple-icon-152x152.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`/favicon/${casinoName}/apple-icon-180x180.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href={`/favicon/${casinoName}/android-icon-192x192.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`/favicon/${casinoName}/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href={`/favicon/${casinoName}/favicon-96x96.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`/favicon/${casinoName}/favicon-16x16.png`}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content={`/favicon/${casinoName}/ms-icon-144x144.png`}
        />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        data-theme={`${(process.env.NEXT_PUBLIC_CASINO_NAME as string).toLowerCase()}`}
        className={`${ThemeArr[process.env.NEXT_PUBLIC_CASINO_NAME as string]}`}
      >
        <SessionProviders session={session}>
          <StoreProviders>
            <ThemeProviders>
              <Navbar />
              <div className="md:flex hidden overflow-auto z-10 sticky top-[75px]">
                <ProviderSelect />
              </div>

              <div className="sm:mt-20 mt-12" />
              {children}

              <Dock />
              {/* <Footer /> */}
              <Toaster />
              <ThemeToggles />
            </ThemeProviders>
          </StoreProviders>
        </SessionProviders>
      </body>
    </html>
  );
}
