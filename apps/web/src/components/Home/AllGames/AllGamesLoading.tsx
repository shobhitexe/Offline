"use client";

import { Skeleton } from "@repo/ui";
import { categoriesMap } from "./CategoriesMap";
import { useSelector } from "react-redux";
import { RootState } from "@/store/root-reducer";

export default function AllGamesLoading() {
  const filters = useSelector((state: RootState) => state.filterCasinoGames);

  type ProviderKey = keyof typeof categoriesMap;
  const filteredCategory = (filters.provider as ProviderKey)
    ? (filters.provider as ProviderKey)
    : "ALL GAMES";

  const casinoName = (
    process.env.NEXT_PUBLIC_CASINO_NAME as string
  ).toLowerCase();

  return (
    <div
      id="allgames"
      className="w-[99%] mx-auto bg-sectionBg royalstars:bg-categoryCardBg sm:mt-5 mt-0.5 sm:p-5 p-3 rounded-lg flex flex-col"
    >
      {/* <div className="flex items-center justify-start w-full mx-auto gap-5 overflow-x-auto overflow-y-hidden no-scrollbar whitespace-nowrap sm:text-base xs:text-sm text-xs">
        {categoriesMap[filteredCategory as ProviderKey].map((category, idx) => {
          return (
            <div
              aria-hidden="true"
              className="cursor-pointer relative group"
              key={category}
              role="button"
              tabIndex={0}
            >
              <div className="inline-block capitalize text-xs">
                {category?.toUpperCase()}
              </div>
              <div
                className={`bg-white w-0 group-hover:w-full h-px duration-300 mx-auto ${filters.category === category && "w-full"}`}
              />
            </div>
          );
        })}
      </div>
      <div className="w-full h-1 bg-[#636363] relative z-0 mt-3" /> */}

      <div
        className={`grid sm:grid-cols-5 ss:grid-cols-4 ${casinoName === "pridegains" ? "grid-cols-3" : "grid-cols-2"} gap-3 mt-3`}
      >
        {Array.from({ length: 12 }).map((item, idx) => {
          return (
            <div
              key={idx}
              className="group relative inline-block overflow-hidden rounded-md cursor-pointer"
            >
              <Skeleton
                className="w-full h-full aspect-square"
                style={{ background: "#2A272C" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
