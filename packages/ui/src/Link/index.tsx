import type { AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  newTab?: boolean;
  href: string;
  linkComponent?: typeof Link;
}

export function LinkComponent({
  children,
  href,
  newTab,
  linkComponent: LinkComponent,
  ...other
}: LinkProps): JSX.Element {
  if (LinkComponent) {
    return (
      <LinkComponent
        className="bg-white text-white"
        href={href}
        rel={newTab ? "noreferrer" : undefined}
        target={newTab ? "_blank" : undefined}
        {...other}
      >
        {children}
      </LinkComponent>
    );
  }

  return (
    <a
      href={href}
      rel={newTab ? "noreferrer" : undefined}
      target={newTab ? "_blank" : undefined}
      {...other}
    >
      {children}
    </a>
  );
}
