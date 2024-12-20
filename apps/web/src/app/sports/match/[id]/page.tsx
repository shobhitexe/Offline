"use client";

import { MatchInfo, MatchLoading, MatchTable, Timer } from "@/components";
import { SportsData } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";

export default function Match({ params }: { params: { id: string[] } }) {
  const session = useSession();

  const [info, setInfo] = useState<SportsData | null>(null);
  const socketInitialized = useRef(false);
  const lastUpdatedInfo = useRef<SportsData | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const updateInfo = useCallback((newData: SportsData) => {
    if (JSON.stringify(newData) !== JSON.stringify(lastUpdatedInfo.current)) {
      lastUpdatedInfo.current = newData;
      setInfo(newData);
    }
  }, []);

  useEffect(() => {
    if (socketInitialized.current) {
      return;
    }

    const newSocket = new WebSocket(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL as string
    );

    newSocket.onopen = () => {
      console.log("Connected to the WebSocket server!");
      newSocket.send(
        JSON.stringify({
          type: "event_id",
          payload: { eventId: params.id },
        })
      );
    };

    newSocket.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      const { type, payload } = eventData;

      if (type === "sports_update" && payload) {
        updateInfo(payload);
      }
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onclose = () => {
      console.log("Disconnected from the WebSocket server!");
    };

    setSocket(newSocket);
    socketInitialized.current = true;

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [params.id, updateInfo]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        socket &&
        session.data?.user.id
      ) {
        socket.send(
          JSON.stringify({
            type: "event_id",
            payload: { eventId: params.id },
          })
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [socket, session.data?.user.id]);

  if (info === null) {
    return <MatchLoading />;
  }

  if (!info.MatchOdds) {
    return <MatchLoading />;
  }

  if (!socket) {
    return <div>Please Reload</div>;
  }

  const TabsArr = [
    { title: "All", value: "all" },
    { title: "Market", value: "market" },
    { title: "Fancy", value: "fancy" },
    { title: "Only Over", value: "onlyover" },
    { title: "Player Run", value: "playerrun" },
    { title: "Boundaries", value: "boundaries" },
    { title: "Wicket", value: "wicket" },
  ];

  return (
    <div className="w-full mx-auto mt-2 space-y-2 pb-40">
      <Timer eventName={info.EventName} eventTime={info.EventTime} />

      {/* <MatchInfo
        matchTime={info.EventTime}
        firstTeam={info.MatchOdds.runners[0].RunnerName}
        secondTeam={info.MatchOdds.runners[1].RunnerName}
      /> */}

      <Tabs defaultValue="all" className="">
        <TabsList style={{ overflowX: "auto" }}>
          {TabsArr.map((item) => (
            <TabsTrigger key={item.title} value={item.value}>
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-2" />

        {TabsArr.map((item) => (
          <TabsContent value={item.value}>
            <MatchTable
              matchOdds={info.MatchOdds}
              Bookmaker={info.BookMaker}
              Fancy={info.Fancy}
              eventId={info.EventId}
              matchName={info.EventName}
              marketId={info.MatchOdds.MarketId}
              tabType={item.value}
              sportsId={info.SportsId}
              competitionId={info.CompetitionId}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
