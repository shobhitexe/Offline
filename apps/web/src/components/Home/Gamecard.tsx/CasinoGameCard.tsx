import { logoMap } from "@/lib/constants/logomap";
import { GameType } from "@repo/types";
import Image from "next/image";
import Link from "next/link";
import { SVGProps } from "react";

export default function CasinoGameCard({
  games,
  category,
  provider,
}: {
  games: GameType[];
  category?: string;
  provider?: string;
}) {
  const casinoName = (
    process.env.NEXT_PUBLIC_CASINO_NAME as string
  ).toLowerCase();

  return (
    <div
      className={`grid sm:grid-cols-5 ss:grid-cols-4 ${casinoName === "pridegains" ? "grid-cols-3" : "grid-cols-2"} gap-3 mt-3`}
    >
      {casinoName === "jackpot1x" &&
        category === "TOP GAMES" &&
        provider === "TOP GAMES" && <ColorTiles />}

      {games.map((item) => {
        const validImageSrc = validateImageUrl(item.url_thumb);

        return (
          <Link
            href={`/casino/game/${item.provider_name}/${item.game_id}`}
            key={item.game_id}
            className="group relative overflow-hidden cursor-pointer rounded-md flex flex-col bg-black group"
          >
            {validImageSrc && (
              <>
                <Image
                  src={validImageSrc}
                  alt={item.game_name}
                  width={480}
                  height={480}
                  className="w-full h-full object-contain aspect-squares rounded-md group-hover:blur-md duration-300"
                  onError={(event) => {
                    event.currentTarget.id =
                      logoMap[casinoName as keyof typeof logoMap] ||
                      logoMap.fallback;
                    event.currentTarget.srcset =
                      logoMap[casinoName as keyof typeof logoMap] ||
                      logoMap.fallback;
                  }}
                />
                <div className="text-center bg-white text-main py-1 font-medium absolutes bottom-0 w-full z-0 sm:text-sm xs:text-xs text-xxs">
                  {item.game_name}
                </div>

                <PlayButton className="absolute w-10 h-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 duration-500" />
              </>
            )}
          </Link>
        );
      })}
    </div>
  );
}

function validateImageUrl(src: string) {
  if (!src) {
    return null;
  }

  const isAbsoluteUrl = src.startsWith("http://") || src.startsWith("https://");
  const isRelativeUrl = src.startsWith("/");

  if (isAbsoluteUrl || isRelativeUrl) {
    return src;
  }

  return "/images/games/fallback.avif";
}

function PlayButton(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="circle-play"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"
      ></path>
    </svg>
  );
}

function ColorTiles() {
  const casinoName = (
    process.env.NEXT_PUBLIC_CASINO_NAME as string
  ).toLowerCase();
  return (
    <>
      <Link
        href={`/games/color-prediction`}
        className="group relative overflow-hidden cursor-pointer rounded-md flex flex-col bg-black group"
      >
        <Image
          src={"/images/games/wingo.png"}
          alt={"wingo"}
          width={480}
          height={480}
          className="w-full h-full object-cover aspect-square rounded-md group-hover:blur-md duration-300"
          onError={(event) => {
            event.currentTarget.id =
              logoMap[casinoName as keyof typeof logoMap] || logoMap.fallback;
            event.currentTarget.srcset =
              logoMap[casinoName as keyof typeof logoMap] || logoMap.fallback;
          }}
        />
        <div className="text-center bg-white text-main py-1 font-medium absolutes bottom-0 w-full z-0 sm:text-sm xs:text-xs text-xxs">
          Wingo
        </div>

        <PlayButton className="absolute w-10 h-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 duration-500" />
      </Link>

      <Link
        href={`/games/color-prediction`}
        className="group relative overflow-hidden cursor-pointer rounded-md flex flex-col bg-black group"
      >
        <Image
          src={"/images/games/5d.png"}
          alt={"5d"}
          width={480}
          height={480}
          className="w-full h-full object-cover aspect-square rounded-md group-hover:blur-md duration-300"
          onError={(event) => {
            event.currentTarget.id =
              logoMap[casinoName as keyof typeof logoMap] || logoMap.fallback;
            event.currentTarget.srcset =
              logoMap[casinoName as keyof typeof logoMap] || logoMap.fallback;
          }}
        />
        <div className="text-center bg-white text-main py-1 font-medium absolutes bottom-0 w-full z-0 sm:text-sm xs:text-xs text-xxs">
          5D
        </div>

        <PlayButton className="absolute w-10 h-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 duration-500" />
      </Link>
    </>
  );
}
