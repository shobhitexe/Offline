import { SVGProps } from "react";

export default function GameTrackerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="far"
      data-icon="gamepad"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M192 112c-79.5 0-144 64.5-144 144s64.5 144 144 144H448c79.5 0 144-64.5 144-144s-64.5-144-144-144H192zM0 256C0 150 86 64 192 64H448c106 0 192 86 192 192s-86 192-192 192H192C86 448 0 362 0 256zm232-56v32h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H232v32c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H152c-13.3 0-24-10.7-24-24s10.7-24 24-24h32V200c0-13.3 10.7-24 24-24s24 10.7 24 24zm168 72a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm32-64a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
      ></path>
    </svg>
  );
}
