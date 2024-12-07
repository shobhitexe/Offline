"use client";

import { SVGProps } from "react";
import Image from "next/image";
import { LinkComponent } from "../Link";
import { Link, animateScroll as scroll } from "react-scroll";

type CategoryCardProps = {
  title: string;
  link: string;
  image: string;
  color: string;
  scroll: string;
  mobileImage: string;
};

export function CategoryCard({
  title,
  link,
  image,
  color,
  scroll,
  mobileImage,
}: CategoryCardProps): JSX.Element {
  return (
    <div className="ui-bg-[#2A272C] sm:ui-p-3 ui-p-1 xs:ui-rounded-xl ui-rounded-md flex ui-relative ui-w-full sm:hover:-ui-translate-y-5 ui-duration-300 max-xs:ui-justify-center">
      <div
        className={`ui-w-full ui-h-full sm:ui-flex ui-hidden ui-absolute ui-right-0 ui-top-0 sm:ui-border-t-[65px] xs:ui-border-t-[50px] ui-border-t-[45px] ui-border-t-transparent sm:ui-border-r-[90px] xs:ui-border-r-[75px] ui-border-r-[60px] ui-rounded-xl sm:ui-border-b-[65px] xs:ui-border-b-[50px] ui-border-b-[45px] ui-border-b-transparent`}
        style={{
          borderRightColor: color,
        }}
      />
      {/* <div
        className={`ui-absolute ui-w-0 ui-z-10 group-hover:ui-w-full group-hover:ui-h-full ui-duration-500 ui-right-0 ui-top-0 ui-rounded-xl`}
        style={{ backgroundColor: color }}
      /> */}
      <div className="flex ui-flex-col sm:ui-gap-10 xs:ui-gap-5 ui-gap-3">
        <div className="ui-flex ui-flex-col ui-gap-2">
          <div
            className={`ui-w-fit flex xs:ui-flex-col ui-flex-row gap-1 ui-font-satoshiBlack sm:ui-text-xl xs:ui-text-lg ui-text-base group-hover:text-white ui-text-[${color}]`}
            style={{ color: color }}
          >
            <Image
              src={mobileImage}
              alt={title}
              width={10}
              height={10}
              className=" ui-w-1/3 ui-h-1/2 ui-aspect-square ui-my-auto xs:ui-hidden"
            />

            <div className="ui-whitespace-nowrap sm:ui-text-base xs:ui-text-xs ui-text-[8px]">
              {title}
            </div>
            <div
              className="ui-w-full ui-h-[2px] xs:ui-flex ui-hidden"
              style={{ backgroundColor: color }}
            ></div>
          </div>
        </div>

        {link !== "" && (
          <LinkComponent
            href={link}
            className="xs:ui-flex ui-hidden ui-z-10 ui-items-center ui-gap-1 sm:ui-border-2 ui-border sm:ui-px-3 ui-px-2 sm:ui-py-2 ui-py-1 sm:ui-rounded-xl ui-rounded-lg ui-cursor-pointer ui-w-fit"
          >
            <span className="ui-text-xs">View Games</span>{" "}
            <ArrowSvg width={15} height={15} className="xs:ui-flex ui-hidden" />{" "}
          </LinkComponent>
        )}

        {scroll !== "" && (
          <Link
            to={scroll}
            spy={true}
            smooth={true}
            offset={-100}
            className="xs:ui-flex ui-hidden ui-z-10 ui-items-center ui-gap-1 sm:ui-border-2 ui-border sm:ui-px-3 ui-px-2 sm:ui-py-2 ui-py-1 sm:ui-rounded-xl ui-rounded-lg ui-cursor-pointer ui-w-fit"
          >
            <span className="ui-text-xs">View Games</span>{" "}
            <ArrowSvg width={15} height={15} className="xs:ui-flex ui-hidden" />{" "}
          </Link>
        )}
      </div>
      {title === "SLOTS" ? (
        <Image
          src={image}
          alt={title}
          width={100}
          height={100}
          className="ui-absolute ui-right-5 sm:-ui-top-5 ui-top-0 sm:ui-w-[120px] ui-w-[70px] xs:ui-flex ui-hidden"
        />
      ) : title === "CRASH" ? (
        <Image
          src={image}
          alt={title}
          width={100}
          height={100}
          className="ui-absolute ui-right-0 sm:-ui-top-5 ui-top-0 sm:ui-w-[120px] ui-w-[70px] xs:ui-flex ui-hidden"
        />
      ) : (
        <Image
          src={image}
          alt={title}
          width={100}
          height={100}
          className="ui-absolute ui-right-0 sm:-ui-top-5 ui-top-0 sm:ui-w-[100px] ui-w-[50px] xs:ui-flex ui-hidden"
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
