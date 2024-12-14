"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { redirect, useSearchParams } from "next/navigation";

export default function SelectComponent({
  data,
  link,
}: {
  data: { title: string; value: string }[];
  link: string;
}) {
  const searchParams = useSearchParams();
  const game = searchParams.get("game") as string;

  return (
    <Select defaultValue={game} onValueChange={(e) => redirect(`${link}${e}`)}>
      <SelectTrigger className="max-w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => (
          <SelectItem key={item.title} value={item.value}>
            {item.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
