"use client";

import { RootState } from "@/store/root-reducer";
import { SeperatorIcon } from "@repo/ui";
import { useSelector } from "react-redux";

const data = [
  { title: "Real Wallet", value: "cash" },
  { title: "Bonus Wallet", value: "bonus" },
];

export default function NavWalletData() {
  const wallet = useSelector((state: RootState) => state.walletBalance);

  return (
    <div className="flex flex-col justify-between items-stretch mt-2 border-b border-main/10 pb-1">
      <div className="flex justify-around relative">
        {data.map((item, idx) => (
          <div key={item.title} className="flex justify-around">
            {" "}
            <div className="flex flex-col items-center">
              <div className="text-main text-xs font-medium">{item.title}</div>
              <div className="font-medium">
                {wallet[item.value as keyof { cash: string; bonus: string }]}
              </div>
            </div>
            {idx === 0 && <Divide />}
          </div>
        ))}
      </div>
    </div>
  );
}

function Divide() {
  return <div className="bg-main/10 w-px h-full relative left-6" />;
}
