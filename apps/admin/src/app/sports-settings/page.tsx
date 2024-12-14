import { PageHeading, sportsSettingsColumns } from "@/components";
import { DataTable } from "@repo/ui";

export default function page() {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Sports Settings</PageHeading>

      <DataTable columns={sportsSettingsColumns} data={[]} />
    </div>
  );
}
