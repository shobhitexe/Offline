import { SVGProps } from "react";

export default function BonusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fad"
      data-icon="gift"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <g>
        <path
          fill="#969392"
          d="M73.6 128c14.6 28.5 44.2 48 78.4 48h64 8v80H32c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32H73.6zM480 256H288V176h72c34.2 0 63.8-19.5 78.4-48H480c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32zM32 288H224V512H80c-26.5 0-48-21.5-48-48V288zM288 512V288H480V464c0 26.5-21.5 48-48 48H288z"
        ></path>
        <path
          fill="currentColor"
          d="M190.5 68.8L225.3 128H224h-8H152c-22.1 0-40-17.9-40-40s17.9-40 40-40h2.2c14.9 0 28.8 7.9 36.3 20.8zM256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0H152C103.4 0 64 39.4 64 88s39.4 88 88 88h64 8v80h64V176h72c48.6 0 88-39.4 88-88s-39.4-88-88-88h-2.2c-31.9 0-61.5 16.9-77.7 44.4L256 85.5zm65.5-16.7C329.1 55.9 342.9 48 357.8 48H360c22.1 0 40 17.9 40 40s-17.9 40-40 40H286.7l34.8-59.2zM288 512V288H224V512h64z"
        ></path>
      </g>
    </svg>
  );
}