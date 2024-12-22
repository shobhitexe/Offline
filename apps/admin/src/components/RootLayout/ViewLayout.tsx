import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "../Sidebar";
import { AppSidebar } from "../Sidebar/app-sidebar";
import Navbar from "../Navbar";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Menu } from "lucide-react";

export default async function ViewLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(options);

  if (!session?.user.id) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <Navbar />
      <SidebarProvider>
        <AppSidebar />
        <main className="flex w-full">
          <SidebarTrigger className="absolute top-2 sm:left-5 left-2 z-50" />

          <div className="p-3 w-full sm:mt-5 mt-3 h-screen overflow-auto pb-60">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
