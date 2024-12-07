import { SVGProps } from "react";

export default function ProfileRoundIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fad"
      data-icon="circle-user"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <g>
        <path
          fill="#6d6a69"
          d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"
        ></path>
        <path
          fill="currentColor"
          d="M256 272a72 72 0 1 0 0-144 72 72 0 1 0 0 144zm0 176c56.8 0 107.8-24.7 143-63.8C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8z"
        ></path>
      </g>
    </svg>
  );
}
