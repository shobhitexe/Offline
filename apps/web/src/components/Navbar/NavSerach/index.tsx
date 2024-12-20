"use client";

import { BackendURL } from "@/config/env";
import fetcher from "@/lib/data/setup";
import { GameType } from "@repo/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  SearchIcon,
  Skeleton,
} from "@repo/ui";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import debounce from "debounce";
import useSWR from "swr";
import CasinoGameCard from "@/components/Home/Gamecard.tsx/CasinoGameCard";
import { AllGamesLoading } from "@/components";

export default function NavSearch({
  position = "navbar",
}: {
  position?: "navbar" | "sidebar" | "home";
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debouncedSearchChange = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 1000),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearchChange(e.target.value);
  };

  const shouldFetch = debouncedSearch.length > 1;

  const { data } = useSWR<{
    data: GameType[];
  }>(
    shouldFetch
      ? `${BackendURL}/api/home/search/games?search=${debouncedSearch}`
      : null,
    fetcher
  );

  return (
    <Dialog>
      <DialogTrigger
        style={{ backgroundColor: "#334155 " }}
        className={`${position === "home" && "w-[95%] mx-auto flex justify-center"} rounded-md mt-5 relative`}
      >
        <div
          className={`border border-gray-700 sm:py-2 py-2 text-xs flex items-center gap-1 ${
            position === "navbar"
              ? "lg:pr-20 md:pr-24 sm:pr-14 max-sm:border-none md:flex hidden"
              : ""
          } md:pl-10 pl-8 rounded-lg relative text-left w-full ${position === "home" && "md:hidden flex w-full h-10"}`}
        >
          <SearchIcon
            width={position === "home" ? 15 : 20}
            height={position === "home" ? 15 : 20}
            className="absolute left-2 top-1/2 -translate-y-1/2"
          />
          <span className={`${position === "navbar" && "sm:flex hidden"}`}>
            Search
          </span>{" "}
          <span className="">your favorite games</span>
        </div>
      </DialogTrigger>
      <DialogContent
        style={{ maxWidth: "800px" }}
        className="ui-max-w-full max-w-4xl"
      >
        <DialogHeader>
          <DialogTitle>Search your favourite games</DialogTitle>
          <DialogDescription className="pt-5">
            <div className="grid w-full items-center gap-1.5">
              <Input
                id="search"
                type="search"
                value={search}
                name="search"
                required
                placeholder="Search games...."
                onChange={handleSearchChange}
              />
            </div>

            <div className="max-h-96 overflow-auto mt-5">
              <CasinoGameCard games={data?.data || []} />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
