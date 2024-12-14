import { PageHeading, resultMarketColumns } from "@/components";
import { DataTable } from "@repo/ui";

export default function page() {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Result Market</PageHeading>

      <DataTable columns={resultMarketColumns} data={[]} />
    </div>
  );
}
