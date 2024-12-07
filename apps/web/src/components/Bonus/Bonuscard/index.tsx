"use client";

import { claimBonus } from "@/lib/apis/bonus";
import { BonusType } from "@repo/types";
import { Button, useToast } from "@repo/ui";

export default function Bonuscard(props: BonusType) {
  const { toast } = useToast();

  const { _id, amount, type } = props;

  return (
    <div className="bg-bonusCardBg w-fit p-5 rounded-lg min-w-80 bg-cover bg-no-repeat bg-right">
      <div>{amount} Bonus</div>

      <div>{type}</div>

      <Button
        className="mt-3 ui-text-white text-white"
        onClick={async () => {
          const res = await claimBonus(_id);

          if (res === true) {
            toast({
              variant: "default",
              description: "Bonus claimed",
            });
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            toast({ variant: "destructive", description: res.toString() });
          }
        }}
      >
        Claim
      </Button>
    </div>
  );
}
