import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import { getServerSession } from "next-auth";
import { SessionProviders } from "./providers";
import { options } from "./api/auth/[...nextauth]/options";
import { ViewLayout } from "@/components";
import { Toaster } from "@repo/ui";

const fira = Fira_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

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
      <body className={fira.className}>
        <SessionProviders session={session}>
          <ViewLayout>{children}</ViewLayout>
          <Toaster />
        </SessionProviders>
      </body>
    </html>
  );
}
