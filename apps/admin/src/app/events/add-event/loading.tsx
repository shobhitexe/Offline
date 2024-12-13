import { addEventColumn } from "@/components";
import { LoadingDataTable, Select } from "@repo/ui";

export default function loading() {
  return (
    <div className="w-full flex flex-col gap-5">
      <Select />

      <LoadingDataTable columns={addEventColumn} />
    </div>
  );
}
