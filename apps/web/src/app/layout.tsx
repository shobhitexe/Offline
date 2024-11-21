import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { getServerSession } from "next-auth";
import { SessionProviders } from "./providers";
import { options } from "./api/auth/[...nextauth]/options";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Offline",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviders session={session}>{children}</SessionProviders>
      </body>
    </html>
  );
}
