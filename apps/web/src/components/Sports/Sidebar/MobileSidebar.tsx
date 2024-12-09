import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui";
import SportsSidebar from ".";
import Image from "next/image";

export default function MobileSidebarSports() {
  return (
    <Sheet>
      <SheetTrigger>
        <Image
          src={"/images/dock/menu.svg"}
          alt={"menu"}
          width={20}
          height={20}
        />
      </SheetTrigger>
      <SheetContent
        style={{ backgroundColor: "#101012", border: 0 }}
        side={"left"}
      >
        <SheetHeader className="mt-4">
          {/* <SheetTitle>Are you absolutely sure?</SheetTitle> */}
          <SportsSidebar />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
