"use client";

import { BackendURL } from "@/config/env";
import fetcher from "@/lib/data/setup";
import { BannerType } from "@repo/types";
import { Button, CarouselDots } from "@repo/ui";
import { Carousel, CarouselContent, CarouselItem } from "@repo/ui";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

export default function Hero() {
  const [delay, setDelay] = useState(25000);

  const { data, isLoading } = useSWR<{ data: BannerType[] }>(
    `${BackendURL}/api/home/banners`,
    fetcher
  );

  const casinoName = (
    process.env.NEXT_PUBLIC_CASINO_NAME as string
  ).toLowerCase();

  if (isLoading) {
    return (
      <div className="max-sm:mx-2 flex items-center justify-center">
        <Image
          src={`/images/games/fallback.png`}
          alt={"bg"}
          width={1280}
          height={350}
          className={`w-full h-fit relative max-sm:border max-sm:border-white/10 backdrop-filter backdrop-blur-md shadow-2xl rounded-xl justify-center sm:mt-3 mt-2`}
        />
      </div>
    );
  }

  return (
    <div className="max-sm:mx-2">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: delay,
            stopOnFocusIn: false,
            stopOnInteraction: false,
            stopOnMouseEnter: false,
          }),
        ]}
      >
        <CarouselContent>
          {process.env.NEXT_PUBLIC_CASINO_NAME === "Deltinstars" && (
            <CarouselItem className="relative h-full">
              <video
                autoPlay
                loop={false}
                muted
                playsInline
                onPlaying={() => {
                  setDelay(25000);
                }}
                onEnded={(e) => {
                  setDelay(3000);
                }}
                className={`w-full ${casinoName === "pridegains" && "min-h-[170px]"} relative max-sm:border max-sm:border-white/10 backdrop-filter backdrop-blur-md shadow-2xl rounded-xl justify-center sm:mt-3 mt-2`}
              >
                <source
                  src="https://color-assets-planetstudio.s3.ap-south-1.amazonaws.com/videos/DeltinStars+Promo+%5B6EF2D67%5D.mp4"
                  type="video/mp4"
                />
              </video>
            </CarouselItem>
          )}
          {data?.data.map((item) => (
            <CarouselItem key={item.id} className="relative h-full">
              <Image
                src={item.banner}
                alt={item.id}
                width={1280}
                height={480}
                className={`w-full ${casinoName === "pridegains" && "min-h-[170px]"} relative max-sm:border max-sm:border-white/10 backdrop-filter backdrop-blur-md shadow-2xl rounded-xl justify-center sm:mt-3 mt-2`}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="sm:bottom-3 bottom-1 sm:left-1/2 max-sm:right-3 sm:-translate-x-1/2 absolute flex sm:gap-3 gap-2">
          <CarouselDots />
        </div>
      </Carousel>
    </div>
  );
}