import { BonusButtons } from "@/components";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:mt-28 mt-16 w-[90%] mx-auto flex flex-col sm:gap-5 gap-3 min-h-screen">
      <h1 className="md:text-4xl sm:text-3xl xs:text-2xl text-xl text-center">
        Bonuses & Promos
      </h1>

      <div className="bg-cardBG min-h-52 p-2 rounded-lg">
        <BonusButtons />

        {children}
      </div>
    </div>
  );
}
