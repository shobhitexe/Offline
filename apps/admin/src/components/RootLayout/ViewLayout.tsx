import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "../Sidebar";
import { AppSidebar } from "../Sidebar/app-sidebar";
import Navbar from "../Navbar";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

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
    <>
      <Navbar />
      <SidebarProvider>
        <AppSidebar />
        <main className="flex w-full relative">
          <SidebarTrigger className="absolute -top-2" />
          <div className="p-3 w-full sm:mt-5 mt-3 h-screen overflow-auto sm:pb-40 pb-20">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}
