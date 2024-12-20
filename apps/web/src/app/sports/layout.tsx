import { SportsSidebar, TopBar } from "@/components";
import Image from "next/image";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="md:grid min-h-screen w-full">
      <div className="hidden md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 bg-cardBG">
          {/* <div className="flex-1 h-full overflow-auto no-scrollbar smt-5">
            <SportsSidebar />
          </div> */}
          {/* <div className="mt-auto p-4"></div> */}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-1 flex-col gap-1 py-1 mt-1 sm:px-4 px-2 lg:gap-6 overflow-auto max-h-screen pb-40 bg-cardBG rounded-md">
          <TopBar />

          {children}
        </div>
      </div>
    </div>
  );
}

// md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]
