"use client";

import { PageHeading } from "@/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Result Market History</PageHeading>

      <div className="flex items-center gap-3">
        <div>
          <div>Select Sports</div>

          <Select>
            <SelectTrigger className="max-w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cricket">Cricket</SelectItem>
              <SelectItem value="tennis">Tennis</SelectItem>
              <SelectItem value="soccer">Soccer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div>Select Market</div>

          <Select>
            <SelectTrigger className="max-w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cricket">Cricket</SelectItem>
              <SelectItem value="tennis">Tennis</SelectItem>
              <SelectItem value="soccer">Soccer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {children}
    </div>
  );
}
