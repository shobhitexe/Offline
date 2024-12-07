"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export function StoreProviders({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <Provider store={store}>{children}</Provider>;
}

export function SessionProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
