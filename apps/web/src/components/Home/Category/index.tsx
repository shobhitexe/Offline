"use client";

import { CategoryCard } from "./CategoryCard";
import React from "react";

const categoryarr = [
  {
    title: "CASINO",
    image: "/images/category/1.webp",
    mobileImage: "/images/category/card-game.png",
    color: "#C881FF",
    category: "Indian Games",
  },
  {
    title: "LIVE CASINO",
    image: "/images/category/3.webp",
    mobileImage: "/images/category/roulette.png",
    color: "#FFB32A",
    category: "Andar Bahar",
  },
  {
    title: "SLOTS",
    image: "/images/category/slots3d.webp",
    mobileImage: "/images/category/777.png",
    color: "#FF6903",
    category: "Slot games",
  },
  {
    title: "CRASH",
    image: "/images/category/crash.webp",
    mobileImage: "/images/category/airplane.png",
    color: "#FF3434",
    category: "Crash Games",
  },
];

export default function Category(): JSX.Element {
  return (
    <>
      <div className="md:flex grid sm:grid-cols-2 xs:grid-cols-2 grid-cols-4 items-center w-full mx-auto justify-center sm:mt-10 xs:mt-5 mt-3 sm:gap-5 gap-2 sm:px-10 xs:px-5 px-3 max-md:flex-wrap">
        {categoryarr.map((card) => {
          return <CategoryCard key={card.title} {...card} />;
        })}
      </div>
    </>
  );
}
