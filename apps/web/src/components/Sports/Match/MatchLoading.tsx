import { Button, buttonVariants, Card, CardContent, Skeleton } from "@repo/ui";
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
    <div className="w-full mx-auto sm:p-4 p-2 space-y-6">
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-4 bg-[#1a1f4d] text-white rounded-lg p-4 min-w-[300px]">
          <h2 className="text-center text-sm mb-2">
            <Skeleton className="w-4 h-4 mx-auto" />
          </h2>

          <div className="grid grid-cols-4 gap-4 text-center">
            {["Days", "Hours", "Min", "Sec"].map((unit) => (
              <div key={unit}>
                <div className="text-xl">
                  <Skeleton className="w-6 h-6 mx-auto" />
                </div>
                <div className="text-xs">{unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="pt-20 bg-white">
        <CardContent
          style={{ padding: 0 }}
          className="flex flex-col items-stretch justify-between w-full "
        >
          <div className="flex flex-row items-center justify-between sm:gap-5 gap-1 sm:px-6 px-4 text-center">
            <div className="flex items-center max-ss:justify-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full sm:flex hidden items-center justify-center sm:text-xl text-base font-bold">
                <Skeleton className="w-8 h-8" />
              </div>
              <div className="sm:text-lg text-sm">
                <Skeleton className="w-20 h-6" />
              </div>
            </div>
            <div className="sm:text-lg text-sm font-bold max-ss:text-center">
              VS
            </div>
            <div className="flex items-center gap-4 max-ss:justify-center">
              <div className="sm:text-lg text-sm">
                <Skeleton className="w-20 h-6" />
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full sm:flex hidden items-center justify-center sm:text-xl text-base font-bold">
                <Skeleton className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between my-4 text-center self-center">
            <div className="text-purple-700 font-medium">
              <Skeleton className="w-24 h-6" />
              <span className="text-sm text-gray-600 ml-2">
                <Skeleton className="w-16 h-4 inline-block ml-2" />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-5 justify-around bg-inputField rounded-md p-1 overflow-x-auto">
        {TabsArr.map((item) => (
          <Link
            href={`${item.value}`}
            key={item.title}
            className={buttonVariants({
              size: "sm",
              className: "w-full",
            })}
          >
            {item.title}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-5 w-full relative">
        <div className="space-y-4 sm:text-base text-sm">
          <div className="grid ss:grid-cols-[1fr_repeat(5,80px)] grid-cols-[1fr_repeat(5,60px)] gap-2">
            <div>{/* <Skeleton className="w-full h-8" /> */}</div>
            <div className="col-span-3">
              {/* <Skeleton className="w-full h-8" /> */}
            </div>
            <Button
              variant="outline"
              className="bg-[#72bbef] text-black hover:bg-[#72bbef]/90"
              style={{ backgroundColor: "#72bbef" }}
            >
              Back
            </Button>
            <Button
              variant="outline"
              className="bg-[#faa9ba] text-black hover:bg-[#faa9ba]/90"
              style={{ backgroundColor: "#faa9ba" }}
            >
              Lay
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-5 h-[200px]">
          <Skeleton className="w-full h-full ui-bg-[#18181A]" />
        </div>
      </div>
    </div>
  );
}
