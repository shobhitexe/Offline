import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import AllCricket from "./AllCricket";

const tabs = [
  "all",
  "market",
  "fancy",
  "only over",
  "player run",
  "boundaries",
  "over",
  "wicket",
];

export default function InfoComponent({ info }: { info: SportsData }) {
  return (
    <div className="p-5">
      <Tabs defaultValue="all">
        <TabsList>
          {tabs.map((item) => (
            <TabsTrigger key={item} value={item}>
              {item.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <AllCricket info={info} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
