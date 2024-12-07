import Image from "next/image";
import type { SVGProps } from "react";

const topEventsArr = [
  { title: "All", image: "/images/top-events/SVG.png" },
  { title: "Cricket", image: "/images/top-events/SVG (1).png" },
  { title: "Football", image: "/images/top-events/SVG (2).png" },
  { title: "Tennis", image: "/images/top-events/SVG (3).png" },
  { title: "Basketball", image: "/images/top-events/SVG (4).png" },
  { title: "Field hockey", image: "/images/top-events/SVG (5).png" },
  { title: "Volletball", image: "/images/top-events/SVG (6).png" },
  { title: "Handball", image: "/images/top-events/SVG (7).png" },
  { title: "Mix fights", image: "/images/top-events/SVG (8).png" },
  { title: "Futsal", image: "/images/top-events/SVG (9).png" },
  { title: "Badminton", image: "/images/top-events/SVG (10).png" },
  { title: "Table Tennis", image: "/images/top-events/SVG (11).png" },
  { title: "Baseball", image: "/images/top-events/SVG (12).png" },
  { title: "Rugby", image: "/images/top-events/SVG (13).png" },
  { title: "Chess", image: "/images/top-events/SVG (14).png" },
  { title: "Beach soccer", image: "/images/top-events/SVG (15).png" },
  { title: "Floorball", image: "/images/top-events/SVG (16).png" },
];

export default function TopEvents(): JSX.Element {
  return (
    <div
      id="topevents"
      className="bg-sectionBg w-[95%] mx-auto mt-5 sm:p-5 p-3 rounded-lg flex flex-col sm:gap-5 gap-3"
    >
      <div className="flex items-center sm:gap-5 gap-2">
        <div className="capitalize md:text-4xl sm:text-3xl xs:text-2xl text-xl">
          TOP EVENTS
        </div>
        <LiveIcon height={40} width={60} className="sm:w-[60px] w-[50px]" />
      </div>

      <div className="w-full h-[4px] bg-[#636363]" />
      <div className="flex items-center sm:justify-around justify-start overflow-x-auto no-scrollbar gap-5">
        {topEventsArr.map((event) => {
          return (
            <div
              className="flex flex-col items-center justify-center gap-2 cursor-pointer"
              key={event.title}
            >
              <Image
                alt={event.title}
                className="sm:w-fit w-[20px] sm:min-w-[25px] min-w-[15px]"
                height={25}
                src={event.image}
                width={25}
              />
              <div className="text-[#B8A8BD] sm:text-sm text-xs whitespace-nowrap">
                {event.title}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-4 grid-cols-2 sm:gap-5 gap-3">
        {[1, 2, 3, 4].map((item) => (
          <Image
            key={item}
            src={`/images/top-events/${item}.svg`}
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

function LiveIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      fill="none"
      viewBox="0 0 87 45"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        height="43.0325"
        rx="14.0162"
        stroke="#6E6C70"
        strokeWidth="1.96754"
        width="85.0325"
        x="0.983772"
        y="0.983772"
      />
      <path
        d="M33.64 15.2587V27.8987H40V29.7188H31.68V15.2587H33.64ZM44.0892 15.2587V29.7188H42.1292V15.2587H44.0892ZM51.4813 29.7188L45.9813 15.2587H48.0813L51.6013 24.4987C51.9213 25.3187 52.2013 26.1387 52.5013 27.2188C52.8413 26.0787 53.1813 25.1187 53.4213 24.4787L56.9213 15.2587H58.9613L53.5213 29.7188H51.4813ZM69.6602 29.7188H60.8402V15.2587H69.6602V17.0587H62.8002V21.5787H68.9802V23.3187H62.8002V27.8987H69.6602V29.7188Z"
        fill="#E6E6E6"
      />
      <rect fill="#F05451" height="10" rx="5" width="10" x="11" y="17.7188" />
    </svg>
  );
}
