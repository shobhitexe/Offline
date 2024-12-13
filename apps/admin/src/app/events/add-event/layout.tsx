"use client";

import { ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { redirect, useSearchParams } from "next/navigation";
import { PageHeading } from "@/components";

export default function layout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();

  const game = searchParams.get("game") as string;

  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Add Event</PageHeading>

      <Select
        defaultValue={game}
        onValueChange={(e) => redirect(`/events/add-event?game=${e}`)}
      >
        <SelectTrigger className="max-w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cricket">Cricket</SelectItem>
          <SelectItem value="tennis">Tennis</SelectItem>
          <SelectItem value="soccer">Soccer</SelectItem>
        </SelectContent>
      </Select>

      {children}
    </div>
  );
}
