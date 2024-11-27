import { ReactNode } from "react";

export default function PageHeading({
  children,
  button,
}: {
  children: ReactNode;
  button?: ReactNode;
}) {
  return (
    <div className="flex items-center w-full justify-between">
      <div className="text-black text-xl">{children}</div>

      {button}
    </div>
  );
}
