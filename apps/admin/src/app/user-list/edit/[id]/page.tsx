import { CreateAgent, CreateUser, EditUser, PageHeading } from "@/components";
import { buttonVariants } from "@repo/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function page({ params }: { params: { id: string } }) {
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
        Edit User
      </PageHeading>

      <EditUser id={params.id} />
    </div>
  );
}
