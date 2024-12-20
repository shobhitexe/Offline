import {
  Button,
  buttonVariants,
  Card,
  CardContent,
  LoadingSpinner,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@repo/ui";
import Link from "next/link";

const TabsArr = [
  { title: "All", value: "all" },
  { title: "Market", value: "market" },
  { title: "Fancy", value: "fancy" },
  { title: "Only Over", value: "onlyover" },
  { title: "Player Run", value: "playerrun" },
  { title: "Boundaries", value: "boundaries" },
  { title: "Wicket", value: "wicket" },
];

export default function MatchLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen h-full">
      <LoadingSpinner className="text-black" />
    </div>
  );
}
