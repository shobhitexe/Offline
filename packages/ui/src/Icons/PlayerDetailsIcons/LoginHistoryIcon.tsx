import { SVGProps } from "react";

export default function LoginHistoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="far"
      data-icon="rectangle-history"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M464 224c0-8.8-7.2-16-16-16L64 208c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-224zm-16-64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64l384 0zm-8-80c13.3 0 24 10.7 24 24s-10.7 24-24 24L72 128c-13.3 0-24-10.7-24-24s10.7-24 24-24l368 0zM392 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L120 48c-13.3 0-24-10.7-24-24s10.7-24 24-24L392 0z"
      ></path>
    </svg>
  );
}
