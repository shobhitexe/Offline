"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@repo/ui";
import SidebarContent from "../SidebarContent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/root-reducer";
import { setSideBarOpen } from "@/store/slices/Sidebar/sidebar-open";
import Image from "next/image";

export default function MobileSidebar(): JSX.Element {
  const dispatch = useDispatch();

  const isOpen = useSelector((root: RootState) => root.sidebarOpen);

  return (
    <Sheet open={isOpen ? undefined : isOpen}>
      <SheetTrigger
        className="sm:hidden flex z-10 flex-col items-center justify-center gap-1"
        onClick={() => dispatch(setSideBarOpen(true))}
      >
        <Image
          src={"/images/dock/menu.svg"}
          alt={"menu"}
          width={30}
          height={30}
        />
        <div className="text-white text-xs font-semibold">Menu</div>
      </SheetTrigger>
      <SheetContent
        className="ui-w-full ui-bg-main border-none ui-p-5"
        side={"bottom"}
        style={{ padding: "20px" }}
      >
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}
