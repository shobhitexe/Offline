"use client";

import { SVGProps } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setCasinoFilter } from "@/store/slices/FilterCasinoGames/filter-casino-games";
import { RootState } from "@/store/root-reducer";

type CategoryCardProps = {
  title: string;
  image: string;
  color: string;
  mobileImage: string;
  category: string;
};

export function CategoryCard({
  title,
  image,
  color,
  mobileImage,
  category,
}: CategoryCardProps): JSX.Element {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filterCasinoGames);

  return (
    <div
      onClick={() => {
        dispatch(
          setCasinoFilter({
            ...filters,
            provider: "TOP GAMES",
            category: category!,
          })
        );
      }}
      className={`bg-categoryCardBg sm:p-3 p-1 xs:rounded-xl rounded-md flex relative w-full sm:hover:-translate-y-5 sm:duration-300 max-xs:justify-center hover:border group`}
      style={{ borderColor: color }}
    >
      <div
        className={`w-full h-full sm:flex hidden absolute right-0 top-0 sm:border-t-[65px] xs:border-t-[50px] border-t-[45px] border-t-transparent sm:border-r-[90px] xs:border-r-[75px] border-r-[60px] rounded-xl sm:border-b-[65px] xs:border-b-[50px] border-b-[45px] border-b-transparent`}
        style={{
          borderRightColor: color,
        }}
      />
      {/* <div
        className={`absolute w-0 z-10 group-hover:w-full group-hover:h-full duration-500 right-0 top-0 rounded-xl`}
        style={{ backgroundColor: color }}
      /> */}
      <div className="flex flex-col sm:gap-10 xs:gap-5 gap-3">
        <div className="flex flex-col gap-2">
          <div
            className={`w-fit flex xs:flex-col flex-row gap-1 font-satoshiBlack sm:text-xl xs:text-lg text-base group-hover:text-white text-[${color}]`}
            style={{ color: color }}
          >
            <Image
              src={mobileImage}
              alt={title}
              width={10}
              height={10}
              className=" w-1/3 h-1/2 aspect-square my-auto xs:hidden group-hover:rotate-[360deg] duration-700"
            />

            <div className="whitespace-nowrap sm:text-base xs:text-xs text-[8px]">
              {title}
            </div>
            <div
              className="w-full h-[2px] xs:flex hidden"
              style={{ backgroundColor: color }}
            ></div>
          </div>
        </div>

        <div className="xs:flex hidden z-10 items-center gap-1 sm:border-2 border sm:px-3 px-2 sm:py-2 py-1 sm:rounded-xl rounded-lg cursor-pointer w-fit">
          <span className="text-xs">View Games</span>{" "}
          <ArrowSvg width={15} height={15} className="xs:flex hidden" />{" "}
        </div>
      </div>
      {title === "SLOTS" ? (
        <Image
          src={image}
          alt={title}
          width={100}
          height={100}
          className="absolute right-5 sm:-top-5 top-0 sm:w-[120px] w-[70px] xs:flex hidden"
        />
      ) : title === "CRASH" ? (
        <Image
          src={image}
          alt={title}
          width={100}
          height={100}
          className="absolute right-0 sm:-top-5 top-0 sm:w-[120px] w-[70px] xs:flex hidden"
        />
      ) : (
        <Image
          src={image}
          alt={title}
          width={100}
          height={100}
          className="absolute right-0 sm:-top-5 top-0 sm:w-[100px] w-[50px] xs:flex hidden"
        />
      )}
    </div>
  );
}

function ArrowSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 13 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.01035 10.2007L6.03414 9.2353L9.42376 5.84568H0.909033V4.4356H9.42376L6.03414 1.05141L7.01035 0.0806197L12.0704 5.14064L7.01035 10.2007Z"
        fill="white"
      />
    </svg>
  );
}
