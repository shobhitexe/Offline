"use client";

import { Button, Input, useToast } from "@repo/ui";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, CircleOff } from "lucide-react";
import { useState } from "react";
import { setSessionResultAction } from "./setSessionResultAction";

export const sessionColumns: ColumnDef<any>[] = [
  {
    accessorKey: "eventId",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "eventName",
    header: "Match Name",
  },
  {
    accessorKey: "RunnerName",
    header: "Session Name",
  },
  {
    accessorKey: "runnerId",
    header: "",
    cell: () => <></>,
  },
  {
    accessorKey: "run",
    header: "Run",
    cell: ({ row }) => {
      const { toast } = useToast();

      const eventId = row.getValue("eventId") as string;
      const eventName = row.getValue("eventName") as string;
      const RunnerName = row.getValue("RunnerName") as string;
      const RunnerId = row.getValue("runnerId") as string;
      const runVal = row.getValue("run") as number;

      const [run, setRun] = useState(0);

      async function submitResultClient() {
        try {
          const res = await setSessionResultAction(
            eventId,
            eventName,
            RunnerName,
            RunnerId,
            run
          );

          if (res !== true) {
            toast({
              description: "Failed to set result",
              variant: "destructive",
            });
            return;
          }

          toast({ description: `Result set successfull` });

          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (error) {
          toast({
            description: "Failed to set result",
            variant: "destructive",
          });
        }
      }

      return (
        <form
          className="cursor-pointer flex items-center gap-4 w-full"
          action={submitResultClient}
        >
          <Input
            name="run"
            type="number"
            id="run"
            placeholder={"Run Value"}
            className="min-w-[80px]"
            disabled={runVal !== 0}
            defaultValue={runVal}
            onChange={(e) => setRun(Number(e.target.value))}
          />
          <Button>
            <CircleCheck />
          </Button>

          <CircleOff />
        </form>
      );
    },
  },
];
