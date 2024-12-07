import { SVGProps } from "react";

export default function SeperatorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="206"
      height="1"
      viewBox="0 0 206 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="206" height="1" fill="url(#paint0_linear_2475_471)" />
      <defs>
        <linearGradient
          id="paint0_linear_2475_471"
          x1="0"
          y1="0.5"
          x2="206"
          y2="0.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1E1E1E" />
          <stop offset="0.479163" stopColor="#BA720D" />
          <stop offset="1" stopColor="#1E1E1E" />
        </linearGradient>
      </defs>
    </svg>
  );
}
