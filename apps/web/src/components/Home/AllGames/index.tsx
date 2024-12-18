"use client";

import { BackendURL } from "@/config/env";
import fetcher from "@/lib/data/setup";
import { RootState } from "@/store/root-reducer";
import { GameType } from "@repo/types";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import useSWRImmutable from "swr/immutable";
import AllGamesLoading from "./AllGamesLoading";
import { setCasinoFilter } from "@/store/slices/FilterCasinoGames/filter-casino-games";
import { setCasinoGamesData } from "@/store/slices/CasinoGames/casino-games-slice";
import { categoriesMap } from "./CategoriesMap";
import { SparklesTextV2 } from "@repo/ui";
import CasinoGameCard from "../Gamecard.tsx/CasinoGameCard";

export default function AllGames() {
  const dispatch = useDispatch();

  const casinoName = (
    process.env.NEXT_PUBLIC_CASINO_NAME as string
  ).toLowerCase();

  const filters = useSelector((state: RootState) => state.filterCasinoGames);

  const { data, error, isLoading } = useSWRImmutable<{
    data: GameType[];
  }>(
    `https://backend.1xbazaar.com/api/home/allgames?provider=${filters.provider}&category=${filters.category}`,
    fetcher
  );

  if (error) {
    return <></>;
  }

  dispatch(setCasinoGamesData(data?.data!));

  if (isLoading) {
    return <AllGamesLoading />;
  }

  // console.log(Object.keys(categoriesMap));

  type ProviderKey = keyof typeof categoriesMap;
  const filteredCategory = (filters.provider as ProviderKey)
    ? (filters.provider as ProviderKey)
    : "TOP GAMES";

  return (
    <>
      <div
        id="allgames"
        className="w-[99%] mx-auto bg-sectionBg sm:mt-5 mt-0.5 sm:p-5 p-3 rounded-lg flex flex-col"
      >
        <div className="flex items-center justify-start w-full mx-auto gap-5 overflow-x-auto overflow-y-hidden no-scrollbar whitespace-nowrap sm:text-base xs:text-sm text-xs">
          {categoriesMap[filteredCategory as ProviderKey].map(
            (category, idx) => {
              return (
                <div
                  aria-hidden="true"
                  className="cursor-pointer relative group"
                  key={category}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    dispatch(
                      setCasinoFilter({ ...filters, category: category! })
                    );
                  }}
                >
                  {casinoName === "onexbazaar" && category === "TOP GAMES" ? (
                    <div className="inline-block capitalize text-xs font-semibold">
                      <SparklesTextV2
                        text={category?.toUpperCase()}
                        colors={{ first: "#00c6fe", second: "#0168c5" }}
                      />
                    </div>
                  ) : (
                    <div className="inline-block capitalize text-xs font-semibold">
                      {category?.toUpperCase()}
                    </div>
                  )}
                  <div
                    className={`bg-white w-0 group-hover:w-full h-px duration-300 mx-auto ${filters.category === category && "w-full"}`}
                  />
                </div>
              );
            }
          )}
        </div>
        {/* <div className="w-full h-1 bg-[#636363] relative z-0 mt-3" /> */}

        <CasinoGameCard
          games={data?.data || []}
          category={filters.category}
          provider={filteredCategory}
        />
      </div>
    </>
  );
}
