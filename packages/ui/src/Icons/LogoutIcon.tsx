import { SVGProps } from "react";

export default function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fad"
      data-icon="arrow-right-from-arc"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <g>
        <path
          fill="#969392"
          d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
        ></path>
        <path
          fill="currentColor"
          d="M345.4 121.4c12.5-12.5 32.8-12.5 45.3 0l112 112c12.5 12.5 12.5 32.8 0 45.3l-112 112c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L402.7 288H192c-17.7 0-32-14.3-32-32s14.3-32 32-32H402.7l-57.4-57.4c-12.5-12.5-12.5-32.8 0-45.3z"
        ></path>
      </g>
    </svg>
  );
}
