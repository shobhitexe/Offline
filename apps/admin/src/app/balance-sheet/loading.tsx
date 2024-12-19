import { balanceSheetColumns, PageHeading } from "@/components";
import { LoadingDataTable } from "@repo/ui";

export default function loading() {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Balance Sheet</PageHeading>

      <div className="flex sm:flex-row flex-col w-full gap-2">
        <LoadingDataTable columns={balanceSheetColumns} buttons={false} />
        <LoadingDataTable columns={balanceSheetColumns} buttons={false} />
      </div>
    </div>
  );
}
