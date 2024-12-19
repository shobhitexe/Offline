import { PageHeading, sessionHistoryColumns } from "@/components";
import { LoadingDataTable } from "@repo/ui";

export default function loading() {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Session History</PageHeading>

      <LoadingDataTable columns={sessionHistoryColumns} />
    </div>
  );
}
