import { PageHeading, resultMarketHistoryColumns } from "@/components";
import { DataTable } from "@repo/ui";

export default function page() {
  return <DataTable columns={resultMarketHistoryColumns} data={[]} />;
}
