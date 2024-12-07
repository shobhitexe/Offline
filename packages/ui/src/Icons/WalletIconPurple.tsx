import { SVGProps } from "react";

export default function WalletIconPurple(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="wallet"
      className="svg-inline--fa fa-wallet border-borderColor ui-p-1.5 ui-rounded-md ui-text-fuchsia-500"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="#d946ef"
        d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
      ></path>
    </svg>
  );
}
