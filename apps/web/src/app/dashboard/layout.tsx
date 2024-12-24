import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return <div className="sm:mt-32 mt-20 pb-40">{children}</div>;
}
