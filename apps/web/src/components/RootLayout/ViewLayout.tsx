import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "../Sidebar";
import { AppSidebar } from "../Sidebar/app-sidebar";
import Navbar from "../Navbar";

export default function ViewLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      <SidebarProvider>
        <AppSidebar />
        <main className="flex w-full relative">
          <SidebarTrigger className="absolute -top-2" />
          <div className="p-3 w-full sm:mt-5 mt-3">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
