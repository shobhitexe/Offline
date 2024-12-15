import { PageHeading, sportsSettingsColumns } from "@/components";
import { DataTable } from "@repo/ui";

const games = [{ name: "Cricket" }, { name: "Tennis" }, { name: "Football" }];

export default function page() {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Sports Settings</PageHeading>

      <DataTable columns={sportsSettingsColumns} data={games} />
    </div>
  );
}
