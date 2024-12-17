import { MobileSidebarSports, SportsSidebar, TopBar } from "@/components";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="md:grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 bg-[#101012]">
          <div className="flex-1 h-full overflow-auto no-scrollbar mt-5">
            <SportsSidebar />
          </div>
          <div className="mt-auto p-4"></div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-1 flex-col gap-4 py-5 sm:px-4 px-2 lg:gap-6 overflow-auto max-h-screen pb-40 bg-[#18181A] rounded-md">
          <div className="md:hidden">
            <MobileSidebarSports />
          </div>

          <TopBar />

          {children}
        </div>
      </div>
    </div>
  );
}
