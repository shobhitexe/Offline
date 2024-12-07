import { Tabs, TabsList, TabsTrigger } from "@repo/ui";

export default function MatchTabs() {
  return (
    <Tabs defaultValue="all">
      <TabsList className="">
        <TabsTrigger
          value="all"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          All
        </TabsTrigger>
        <TabsTrigger
          value="market"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          Market
        </TabsTrigger>
        <TabsTrigger
          value="fancy"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          Fancy
        </TabsTrigger>
        <TabsTrigger
          value="only-over"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          Only Over
        </TabsTrigger>
        <TabsTrigger
          value="player-run"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          Player Run
        </TabsTrigger>
        <TabsTrigger
          value="boundaries"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          Boundaries
        </TabsTrigger>
        <TabsTrigger
          value="wicket"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          Wicket
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
