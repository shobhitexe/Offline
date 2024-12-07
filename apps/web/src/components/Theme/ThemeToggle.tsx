"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ThemeToggles() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const casinoName = process.env.NEXT_PUBLIC_CASINO_NAME as string;
    setTheme(casinoName.toLowerCase());
  }, []);

  return <></>;
}
