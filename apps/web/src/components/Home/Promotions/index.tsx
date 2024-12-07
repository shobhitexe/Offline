"use client";

import { useState } from "react";

const category = [
  { title: "All" },
  { title: "Sport (1)" },
  { title: "Casino (1)" },
];

export default function Promotions(): JSX.Element {
  const [selected, setSelected] = useState(0);

  return (
    <div className="bg-sectionBg w-[95%] mx-auto mt-5 sm:p-5 p-3 rounded-lg pb-[250px] flex flex-col sm:gap-5 gap-3">
      <div className="flex sm:flex-row flex-col items-center sm:gap-5 gap-3">
        <div className="capitalize md:text-4xl sm:text-3xl xs:text-2xl text-xl">
          PROMOTIONS
        </div>
        <div className="flex items-center gap-2">
          {category.map((item, idx) => {
            return (
              <div
                aria-hidden="true"
                className={`sm:text-base xs:text-sm text-xs ${selected === idx ? "bg-[#E3A11C]" : "bg-[#E3A11C]/20"} sm:px-7 px-5 py-2 rounded cursor-pointer`}
                key={item.title}
                onClick={() => {
                  setSelected(idx);
                }}
                role="button"
              >
                {item.title}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full sm:h-[4px] h-1 bg-[#636363]" />
      <div className="flex items-center justify-around" />
    </div>
  );
}
