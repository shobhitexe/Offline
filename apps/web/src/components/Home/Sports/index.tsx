import Image from "next/image";

const sportsArr = [
  { title: "LIVE", sub: "65 Events", image: "/images/sports/1.png" },
  { title: "IPL", sub: "Cricket", image: "/images/sports/2.png" },
  { title: "Bundesliga", sub: "Football", image: "/images/sports/3.png" },
  { title: "La Liga", sub: "Football", image: "/images/sports/4.png" },
];

export default function Sports(): JSX.Element {
  return (
    <div
      id="sports"
      className="bg-sectionBg w-[95%] mx-auto mt-5 sm:p-5 p-3 rounded-lg flex flex-col sm:gap-3 gap-1"
    >
      <div className="capitalize md:text-4xl sm:text-3xl xs:text-2xl text-xl">
        SPORTS
      </div>
      <div className="w-full sm:h-[4px] h-1 bg-[#636363]" />
      <div className="flex items-center">
        {sportsArr.map((sport) => {
          return <div key={sport.title} />;
        })}
      </div>

      <div className="grid sm:grid-cols-4 grid-cols-2 sm:gap-5 gap-3">
        {[1, 2, 3, 4].map((item) => (
          <Image
            key={item}
            src={`/images/sports/${item}.svg`}
            alt={`${item}`}
            width={720}
            height={480}
            className=" basis-1/4"
          />
        ))}
      </div>
    </div>
  );
}
