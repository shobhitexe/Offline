"use client";

import { Button, Input, useToast } from "@repo/ui";
import { useState, ChangeEvent, FormEvent } from "react";

type Chip = {
  name: string;
  value: number;
};

export default function Page() {
  const { toast } = useToast();

  const [chips, setChips] = useState<Chip[]>(() => {
    const savedChips = localStorage.getItem("chipsData");
    return savedChips
      ? JSON.parse(savedChips)
      : [
          { name: "100", value: 100 },
          { name: "500", value: 500 },
          { name: "1K", value: 1000 },
          { name: "5K", value: 5000 },
          { name: "10K", value: 10000 },
          { name: "25K", value: 25000 },
          { name: "50K", value: 50000 },
          { name: "1L", value: 100000 },
          { name: "5L", value: 500000 },
          { name: "10L", value: 1000000 },
        ];
  });

  const handleChipChange = (
    index: number,
    field: "name" | "value",
    value: string
  ) => {
    const updatedChips = [...chips];
    if (field === "value") {
      updatedChips[index][field] = parseInt(value, 10) || 0;
    } else {
      updatedChips[index][field] = value;
    }
    setChips(updatedChips);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("chipsData", JSON.stringify(chips));
    toast({ description: "Saved" });
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-900 text-white sm:w-[60%] w-[90%] mx-auto mb-40">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex sm:gap-6 gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Chips Name</h3>
            {chips.map((chip, index) => (
              <div key={index} className="mb-4">
                <Input
                  className="w-full bg-gray-800 text-black border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={chip.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChipChange(index, "name", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Chips Value</h3>
            {chips.map((chip, index) => (
              <div key={index} className="mb-4">
                <Input
                  type="number"
                  className="w-full bg-gray-800 text-black border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={chip.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChipChange(index, "value", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <Button type="submit" variant={"secondary"}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
