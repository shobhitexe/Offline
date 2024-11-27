import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";

export default function SelectChildLevel() {
  return (
    <Select required name="childLevel">
      <SelectTrigger className="w-[180px] max-w-sm">
        <SelectValue placeholder="Child Level" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 8 }).map((_, idx) => (
          <SelectItem key={idx} value={(idx + 1).toString()}>
            {idx + 1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
