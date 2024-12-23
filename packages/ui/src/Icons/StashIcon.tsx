import { SVGProps } from "react";

export default function StashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fad"
      data-icon="rectangle-history"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <g>
        <path
          fill="currentColor"
          d="M464 104c0-13.3-10.7-24-24-24L72 80c-13.3 0-24 10.7-24 24s10.7 24 24 24l368 0c13.3 0 24-10.7 24-24zM416 24c0-13.3-10.7-24-24-24L120 0C106.7 0 96 10.7 96 24s10.7 24 24 24l272 0c13.3 0 24-10.7 24-24z"
        ></path>
        <path
          fill="currentColor"
          d="M448 160c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64l384 0z"
        ></path>
      </g>
    </svg>
  );
}
