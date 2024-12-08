import Link from "next/link";
import Search from "../Search";

import { ArrowRight } from "lucide-react";

export default function SportsSidebar() {
  return (
    <nav className="grid items-start px-2 text-sm lg:px-4">
      <Search />

      <div className="mt-5">
        <div className="bg-[#232325] p-3 rounded-md cursor-pointer flex items-center justify-between">
          My Bets <ArrowRight />
        </div>
      </div>

      <Link href={"/sports/cricket"} className="mt-2">
        <div className="bg-[#232325] p-3 rounded-md cursor-pointer flex items-center justify-between">
          Cricket <ArrowRight />
        </div>
      </Link>
    </nav>
  );
}
