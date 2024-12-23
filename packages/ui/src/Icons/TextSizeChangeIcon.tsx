import { SVGProps } from "react";

export default function TextSizeChangeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="text-size"
      className="svg-inline--fa fa-text-size size-5"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M64 128V96h96l0 320H128c-17.7 0-32 14.3-32 32s14.3 32 32 32H256c17.7 0 32-14.3 32-32s-14.3-32-32-32H224l0-320h96v32c0 17.7 14.3 32 32 32s32-14.3 32-32V80c0-26.5-21.5-48-48-48H192 48C21.5 32 0 53.5 0 80v48c0 17.7 14.3 32 32 32s32-14.3 32-32zM384 304V288h64l0 128H432c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H512l0-128h64v16c0 17.7 14.3 32 32 32s32-14.3 32-32V272c0-26.5-21.5-48-48-48H368c-26.5 0-48 21.5-48 48v32c0 17.7 14.3 32 32 32s32-14.3 32-32z"
      ></path>
    </svg>
  );
}
