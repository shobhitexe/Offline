"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { redirect, useRouter, useSearchParams } from "next/navigation";

export default function SelectComponent({
  data,
  link,
  param,
}: {
  data: { title: string; value: string }[];
  link: string;
  param: string;
}) {
  const searchParams = useSearchParams();
  const game = searchParams.get(param) as string;

  const router = useRouter();

  return (
    <Select
      defaultValue={game}
      onValueChange={(e) => router.push(`${link}${e}`)}
    >
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
