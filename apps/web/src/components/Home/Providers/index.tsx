import Image from "next/image";

const providerimgarr = [
  "/images/providers/ag.png",
  "/images/providers/dg.png",
  "/images/providers/evo.png",
  "/images/providers/spribe.png",
  "/images/providers/ezugi.png",
];

export default function Providers(): JSX.Element {
  return (
    <div className="ss:flex hidden items-stretch flex-1 flex-wrap justify-center gap-10 mt-20">
      {providerimgarr.map((provider, idx) => {
        return (
          <div
            className="p-[1px] bg-gradient-to-b from-transparent to-[#905A0B] rounded-lg flex items-center justify-center w-[250px]"
            key={provider}
          >
            <div className="w-full bg-black mx-auto rounded-lg h-full">
              <Image
                alt="provider"
                className={`pt-5 pb-3 ${idx < 3 ? "w-[60%]" : "w-[40%]"} mx-auto`}
                height={150}
                src={provider}
                width={250}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
