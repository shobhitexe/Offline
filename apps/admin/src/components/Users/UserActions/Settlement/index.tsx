"use client";

import { changeHandler } from "@/utils/changeHandler";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormInput,
  useToast,
} from "@repo/ui";
import { useState } from "react";
import { settlementAction, settlementActionAgent } from "./settlementAction";
import { useSession } from "next-auth/react";

export default function Settlement({
  settlement,
  id,
  name,
  table = "userlist",
  userType,
}: {
  settlement: number;
  id: string;
  name: string;
  table?: "userlist" | "balancesheet";
  userType: "user" | "agent";
}) {
  const session = useSession();

  const { toast } = useToast();

  const [cash, setCash] = useState<number | undefined>(undefined);

  async function SettlementActionClient(formdata: FormData) {
    try {
      if (cash === undefined) {
        toast({ description: "Enter some amount" });
        return;
      }

      switch (userType) {
        case "user":
          const res = await settlementAction(
            formdata,
            cash,
            session.data?.user.id!,
            id,
            settlement > 0 ? "debit" : "credit"
          );

          if (res !== true) {
            toast({ description: "Failed", variant: "destructive" });
            return;
          }

          toast({ description: "Setteled" });
          break;

        case "agent":
          const _res = await settlementActionAgent(
            formdata,
            cash,
            session.data?.user.id!,
            id,
            settlement > 0 ? "debit" : "credit"
          );

          if (_res !== true) {
            toast({ description: "Failed", variant: "destructive" });
            return;
          }

          toast({ description: "Setteled" });
          break;

        default:
          break;
      }
    } catch (error) {
      toast({ description: "Failed", variant: "destructive" });
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="ui-py-1.5 ui-text-sm ui-px-2" asChild>
        {table === "userlist" ? (
          <div
            className={`${settlement === 0 ? "bg-gray-500" : settlement < 0 ? "bg-red-500" : "bg-green-500"} cursor-pointer p-1 rounded w-full text-right`}
          >
            {settlement}
          </div>
        ) : (
          <div className="bg-yellow-500 p-1 rounded w-fit cursor-pointer">
            Settlement
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{name} : Settlement</DialogTitle>
        </DialogHeader>

        <form
          method="POST"
          className="flex flex-col gap-3"
          action={SettlementActionClient}
        >
          <FormInput
            name="pnl"
            type="number"
            id="pnl"
            value={settlement}
            disabled
            label={"Profit/Loss :"}
            containerClassname="max-w-full"
          />

          <FormInput
            name="cash"
            type="number"
            id="cash"
            value={cash}
            label={"Cash :"}
            required
            min={0}
            onChange={(e) => {
              if (Math.abs(settlement) - Number(e.target.value) < 0) {
                setCash(0);
              } else {
                setCash(Math.abs(Number(e.target.value)));
              }
            }}
            containerClassname="max-w-full"
          />

          <div className="flex items-center justify-center gap-3 text-xs">
            <div
              className="bg-green-200 p-1 text-black cursor-pointer"
              onClick={() => {
                setCash(Math.abs(settlement));
              }}
            >
              Full Amount
            </div>
            <div
              className="bg-red-200 p-1 text-black cursor-pointer"
              onClick={() => {
                setCash(0);
              }}
            >
              Clear
            </div>
          </div>

          <FormInput
            name="remain"
            type="number"
            id="remain"
            value={Math.abs(settlement) - (cash ? cash : 0)}
            disabled
            label={"Remain Cash :"}
            containerClassname="max-w-full"
          />

          <FormInput
            name="remarks"
            type="text"
            id="remarks"
            required
            label={"Remarks :"}
            containerClassname="max-w-full"
          />

          <FormInput
            name="password"
            type="password"
            required
            id="password"
            label={"Password :"}
            containerClassname="max-w-full"
          />

          <Button>Cash Settlement</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
