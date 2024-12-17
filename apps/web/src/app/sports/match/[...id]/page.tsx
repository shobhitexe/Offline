"use client";

import { MatchInfo, MatchTable, MatchTabs, Timer } from "@/components";

import { SportsData } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";

export default function Match({ params }: { params: { id: string[] } }) {
  const { data: session, status } = useSession();

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connId, setConnId] = useState<string>("");

  const [info, setInfo] = useState<SportsData | null>(null);

  const socketInitialized = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      return;
    }

    if (socketInitialized.current) {
      return;
    }

    const newSocket = new WebSocket(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL as string
    );

    newSocket.onopen = () => {
      console.log("Connected to the WebSocket server!");
    };

    newSocket.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      const { type } = eventData;

      if (type === "send_id") {
        setConnId(eventData.payload.connectionId);
      } else if (type === "event_data") {
        if (eventData.payload.data) {
          setInfo(eventData.payload.data);
        }
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
  }, [status]);

  useEffect(() => {
    if (connId && socket && session?.user.id) {
      socket.send(
        JSON.stringify({
          type: "event_data",
          payload: { eventId: params.id[0], connectionId: connId },
        })
      );

      const intervalId = setInterval(() => {
        socket.send(
          JSON.stringify({
            type: "event_data",
            payload: { eventId: params.id[0], connectionId: connId },
          })
        );
      }, 500);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [connId, socket, session?.user.id]);

  if (info === null) {
    return <div>Loading....</div>;
  }

  if (!info.MatchOdds) {
    return <div>Loading....</div>;
  }

  return (
    <div className="w-full mx-auto sm:p-4 p-2 space-y-6">
      <Timer eventName={info.EventName} eventTime={info.EventTime} />

      <MatchInfo
        matchTime={info.EventTime}
        firstTeam={info.MatchOdds.runners[0].RunnerName}
        secondTeam={info.MatchOdds.runners[1].RunnerName}
      />

      <MatchTabs />

      <MatchTable
        matchOdds={info.MatchOdds}
        Bookmaker={info.BookMaker}
        Fancy={info.Fancy}
        eventId={info.EventId}
        matchName={info.EventName}
        marketId={info.MatchOdds.MarketId}
        tabType={params.id[1]}
        sportsId={info.SportsId}
        competitionId={info.CompetitionId}
      />
    </div>
  );
}

// async function getInfo(id: string) {
//   try {
//     const res = await fetch(
//       `http://localhost:8080/api/v1/sports/getEventDetail?eventId=${id}`
//     );

//     if (res.status !== 200) {
//       return null;
//     }

//     const _res = await res.json();

//     return _res.data;
//   } catch (error) {
//     return null;
//   }
// }

// export default async function Match({ params }: { params: { id: string[] } }) {
//   const info: SportsData = await getInfo(params.id[0]);

//   return (
//     <div className="w-full mx-auto sm:p-4 p-2 space-y-6">
//       <Timer eventName={info.EventName} eventTime={info.EventTime} />

//       <MatchInfo
//         matchTime={info.EventTime}
//         firstTeam={info.MatchOdds.runners[0].RunnerName}
//         secondTeam={info.MatchOdds.runners[1].RunnerName}
//       />

//       <MatchTabs />

//       <MatchTable
//         matchOdds={info.MatchOdds}
//         Bookmaker={info.BookMaker}
//         Fancy={info.Fancy}
//         eventId={info.EventId}
//         matchName={info.EventName}
//         marketId={info.MatchOdds.MarketId}
//         tabType={params.id[1]}
//       />
//     </div>
//   );
// }
