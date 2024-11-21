const DemoStats = [
  {
    heading: "Parent",
    data: [
      { title: "Credit Reference", value: "50000000" },
      { title: "Master Balance", value: "9900000" },
      { title: "Settlement", value: "-314.61" },
    ],
  },
  {
    heading: "Own",
    data: [
      { title: "Credit Reference", value: "50000000" },
      { title: "Profit Loss", value: "-3,283.51" },
      { title: "PL with Balance", value: "9,896,716.49" },
    ],
  },
  {
    heading: "Child",
    data: [
      { title: "Credit Reference", value: "50000000" },
      { title: "Balance", value: "-3,283.51" },
      { title: "Settlement", value: "9,896,716.49" },
    ],
  },
];

const DemoInfo = [
  [
    { title: "Logged In Clients", value: "27" },
    { title: "Active Clients", value: "2" },
  ],
  [
    { title: "Weekly Pl", value: "3,902.18" },
    { title: "Weekly Session Commision", value: "-160.04" },
  ],
];

export default async function page() {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="text-black text-xl">Dashboard</div>

      <div className="grid sm:grid-cols-3 ss:grid-cols-2 grid-cols-1 w-full items-center justify-between gap-5">
        {DemoStats.map((item) => (
          <StatsCard key={item.heading} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {DemoInfo.map((item) =>
          item.map((_item) => (
            <div
              key={_item.title}
              className="bg-white p-5 rounded-xl shadow-lg"
            >
              <InfoCard {..._item} />
            </div>
          ))
        )}
      </div>

      <div>
        <div></div>
      </div>
    </div>
  );
}

function StatsCard({
  heading,
  data,
}: {
  heading: string;
  data: { title: string; value: string }[];
}) {
  return (
    <div className="text-black w-full bg-white shadow-xl flex flex-col gap-2 p-3 rounded-xl">
      <div className="text-base">{heading}</div>
      <div className="flex flex-col gap-3">
        {data.map((item) => (
          <div key={item.title} className="flex justify-between text-sm">
            <div>{item.title}</div>
            <div>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-[#f2f7f9] p-5 text-right rounded-xl">
      <div className="text-2xl">{value}</div>
      <div className="text-sm text-[#95a7b2]">{title}</div>
    </div>
  );
}
