import { tournamentSettingsColumns } from "@/components";
import { DataTable } from "@repo/ui";

export default function page() {
  return <DataTable columns={tournamentSettingsColumns} data={[]} />;
}
