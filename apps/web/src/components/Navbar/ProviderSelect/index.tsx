"use client";

import { RootState } from "@/store/root-reducer";
import { setCasinoFilter } from "@/store/slices/FilterCasinoGames/filter-casino-games";
import { SparklesTextV2 } from "@repo/ui";
// import { SparklesTextV2 } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const providers = [
  "TOP GAMES",
  "Ezugi",
  "Evolution Gaming",
  "Super Spade Games",
  "SuperNowa",
  "Bombay Live",
  "Asia Gaming",
  "SPRIBE",
  "Playtech",
  "Pragmatic Play Live",
  "Beter Live",
  "TVBet",
  "VivoGaming",
  "Royal Gaming",
  "Bgaming",

  // "OneTouch",
  // "Winfinity",
  // "Betsoft",
  // "Tangente",
  // "Hacksaw Gaming",
  // "Wazdan",
  // "Relax Gaming",
  // "Pragmatic Play 2",
  // "Smartsoft Gaming",
  // "JiLi Gaming",
  // "Pragmatic Play",
  // "SEXYBCRT",
  // "Lotto Instant Win",
  // "Evoplay Entertainment",
  // "CandleBets",
  // "RT",
  // "BGaming",
  // "KINGMAKER",
  // "BetGames.TV",
  // "BetGames",
  // "Royal Gaming Virtual",
  // "Golden Race",
  // "Parlaybay",
];

export default function ProviderSelect() {
  const dispatch = useDispatch();

  const filterdata = useSelector((state: RootState) => state.filterCasinoGames);

  const router = useRouter();

  const casinoName = (
    process.env.NEXT_PUBLIC_CASINO_NAME as string
  ).toLowerCase();

  const _providers = useMemo(() => {
    const updatedProviders = [...providers];
    if (casinoName === "jackpot1x") {
      updatedProviders.unshift("Color Prediction");
    }
    return updatedProviders;
  }, [casinoName]);

  return (
    <div className="flex items-center md:justify-center justify-start gap-5 pt-2 w-[99%] mx-auto">
      {_providers.map((provider) => {
        return (
          <div
            key={provider}
            className="text-xs cursor-pointer flex flex-col group whitespace-nowrap uppercase font-semibold"
            onClick={() => {
              if (
                casinoName === "jackpot1x" &&
                provider === "Color Prediction"
              ) {
                router.push("/games/color-prediction");
                return;
              }

              dispatch(setCasinoFilter({ category: "TOP GAMES", provider }));
            }}
          >
            {provider === "Color Prediction" ? (
              <SparklesTextV2 text={provider} />
            ) : (
              provider
            )}
            <div
              className={`bg-white w-1 group-hover:w-fulls h-px duration-300 mx-auto ${filterdata.provider === provider && "w-full"}`}
            />
          </div>
        );
      })}
    </div>
  );
}
