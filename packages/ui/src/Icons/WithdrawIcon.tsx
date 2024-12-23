import { SVGProps } from "react";

export default function WithdrawIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fad"
      data-icon="money-bill-1"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      {...props}
    >
      <g>
        <path
          fill="#969392"
          d="M448 128H128c0 35.3-28.7 64-64 64V320c35.3 0 64 28.7 64 64H448c0-35.3 28.7-64 64-64V192c-35.3 0-64-28.7-64-64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
        ></path>
        <path
          fill="currentColor"
          d="M0 128C0 92.7 28.7 64 64 64H512c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zm128 0c0 35.3-28.7 64-64 64V320c35.3 0 64 28.7 64 64H448c0-35.3 28.7-64 64-64V192c-35.3 0-64-28.7-64-64H128zm144 60h16c11 0 20 9 20 20v68h4c11 0 20 9 20 20s-9 20-20 20H288 264c-11 0-20-9-20-20s9-20 20-20h4V227.6c-9.1-1.9-16-9.9-16-19.6c0-11 9-20 20-20z"
        ></path>
      </g>
    </svg>
  );
}
