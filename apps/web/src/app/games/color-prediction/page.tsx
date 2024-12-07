// "use client";

import { ColorPrediction } from "@/components";

export default function page() {
  // const handle = useFullScreenHandle();

  const casinoName = (
    process.env.NEXT_PUBLIC_CASINO_NAME as string
  ).toLowerCase();

  if (casinoName !== "jackpot1x") {
    return <></>;
  }

  return (
    <div className="relative h-full bg-[#091736] bg-center bg-contain bg-no-repeat flex flex-col gap-2 sm:px-1 sm:py-3 rounded-xl">
      {/* <FullScreen handle={handle} className="w-full h-full bg-black"> */}
      <ColorPrediction />
      {/* </FullScreen> */}
    </div>
  );
}
