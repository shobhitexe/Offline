"use client";

import { useEffect } from "react";

export default function Tawkto() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${process.env.NEXT_PUBLIC_TAWK_TO_ID}`;
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className=" relative">
      {/* <div id="tawk_672253fd4304e3196adab988" className=" absolute"></div> */}
    </div>
  );
}
