import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { useSession } from "next-auth/react";

export default function SelectChildLevel() {
  const session = useSession();

  return (
    <Select required name="childLevel">
      <SelectTrigger className="w-[180px] max-w-sm">
        <SelectValue placeholder="Child Level" />
      </SelectTrigger>
      <SelectContent>
        {[1, 2, 3, 4, 5, 6, 7, 8].reverse().map((level) => {
          if (level + 1 > Number(session.data?.user.childLevel)) {
            return;
          }

          return (
            <SelectItem key={level} value={level.toString()}>
              {level}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
