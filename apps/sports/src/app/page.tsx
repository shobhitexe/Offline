import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui";

import {
  ClubIcon as Football,
  TurtleIcon as TennisBall,
  ShoppingBasketIcon as Basketball,
  BirdIcon as Cricket,
  JoystickIcon as HockeyStick,
  Menu,
} from "lucide-react";
import Soccer from "@/components/soccer";
import Tennis from "@/components/tennis";
import CricketComponent from "@/components/cricket";
import CricketComponentV2 from "@/components/cricketv2";

export default function SportsBettingApp() {
  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      {/* <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">BetPro</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-64px)] p-4">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <CircleDollarSign className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Live Betting
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Wallet className="mr-2 h-4 w-4" />
              My Bets
            </Button>
            <Separator className="my-4" />
            <h2 className="font-semibold mb-2">Sports</h2>
            <Button variant="ghost" className="w-full justify-start">
              <Football className="mr-2 h-4 w-4" />
              Soccer
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <TennisBall className="mr-2 h-4 w-4" />
              Tennis
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Basketball className="mr-2 h-4 w-4" />
              Basketball
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Cricket className="mr-2 h-4 w-4" />
              Cricket
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Gamepad2 className="mr-2 h-4 w-4" />
              eSports
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <HockeyStick className="mr-2 h-4 w-4" />
              Ice Hockey
            </Button>
          </nav>
        </ScrollArea>
      </aside> */}

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Top Matches</h1>
          <div className="flex items-center gap-2">
            {/* <Button variant="outline">
              <Wallet className="mr-2 h-4 w-4" />
              Balance: $1000
            </Button> */}
          </div>
        </div>
        <Tabs defaultValue="cricket" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="cricket">
              <Cricket className="mr-2 h-4 w-4" />
              Cricket
            </TabsTrigger>

            <TabsTrigger value="soccer">
              <Football className="mr-2 h-4 w-4" />
              Soccer
            </TabsTrigger>
            <TabsTrigger value="tennis">
              <TennisBall className="mr-2 h-4 w-4" />
              Tennis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cricket">
            <Card>
              <CardHeader>
                {/* <CardTitle>Premier League</CardTitle> */}
              </CardHeader>
              <CardContent>
                <CricketComponentV2 />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="soccer">
            <Card>
              <CardHeader>
                {/* <CardTitle>Premier League</CardTitle> */}
              </CardHeader>
              <CardContent>
                <Soccer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tennis">
            <Card>
              <CardHeader>
                {/* <CardTitle>Premier League</CardTitle> */}
              </CardHeader>
              <CardContent>
                <Tennis />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
