import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed w-full h-full left-0 top-0 z-50">{children}</div>
  );
}
