import { sessionColumns } from "@/components";
import { DataTable } from "@repo/ui";

export default function page() {
  return <DataTable columns={sessionColumns} data={[]} />;
}
