import { CreateAgent, PageHeading } from "@/components";
import { buttonVariants } from "@repo/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading
        button={
          <Link
            href={"/list"}
            className={`${buttonVariants({
              variant: "default",
              size: "sm",
              className: "ui-inline-flex ui-items-center",
            })}`}
          >
            <ArrowLeft />
            <div className="mt-px">Back</div>
          </Link>
        }
      >
        Create Agent
      </PageHeading>

      <CreateAgent />
    </div>
  );
}
