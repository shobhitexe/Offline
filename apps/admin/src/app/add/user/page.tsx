import { CreateAgent, CreateUser, PageHeading } from "@/components";
import { buttonVariants } from "@repo/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading
        button={
          <Link
            href={"/user-list"}
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
        Create User
      </PageHeading>

      <CreateUser />
    </div>
  );
}