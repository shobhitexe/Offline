"use client";

import { MatchInfo, MatchTable, Timer } from "@/components";
import { SportsData } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef, useCallback } from "react";

export default function Match({ params }: { params: { id: string } }) {
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

  console.log(info);

  if (info === null) {
    return <>Loading</>;
  }

  if (!info.MatchOdds) {
    return <>Loading</>;
  }

  if (!socket) {
    return <div>Please Reload</div>;
  }

  return (
    <div className="w-full mx-auto sm:p-4 p-2 space-y-6">
      <Timer eventName={info.EventName} eventTime={info.EventTime} />

      <MatchInfo
        matchTime={info.EventTime}
        firstTeam={info.MatchOdds.runners[0].RunnerName}
        secondTeam={info.MatchOdds.runners[1].RunnerName}
      />

      <MatchTable
        matchOdds={info.MatchOdds}
        Bookmaker={info.BookMaker}
        Fancy={info.Fancy}
        eventId={info.EventId}
        matchName={info.EventName}
        marketId={info.MatchOdds.MarketId}
        tabType={params.id[1]}
      />
    </div>
  );
}
