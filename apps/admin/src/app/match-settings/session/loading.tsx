import { sessionColumns } from "@/components";
import { LoadingDataTable } from "@repo/ui";

export default function loading() {
  return <LoadingDataTable columns={sessionColumns} />;
}
