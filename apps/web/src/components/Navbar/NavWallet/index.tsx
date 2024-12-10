"use client";

import { RootState } from "@/store/root-reducer";
import { setWalletBalance } from "@/store/slices/Wallet/wallet-balance";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function NavWallet() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const balance = useSelector((state: RootState) => state.walletBalance);

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connId, setConnId] = useState<string>("");

  const socketInitialized = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      return;
    }

    if (socketInitialized.current) {
      return;
    }

    const newSocket = new WebSocket("ws://localhost:8080/ws");

    newSocket.onopen = () => {
      console.log("Connected to the WebSocket server!");
    };

    newSocket.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      const { type } = eventData;

      if (type === "send_id") {
        setConnId(eventData.payload.connectionId);
      } else if (type === "wallet_balance") {
        if (eventData.payload.to) {
          dispatch(
            setWalletBalance({
              balance: eventData.payload.balance,
              exposure: eventData.payload.exposure,
            })
          );
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
        // newSocket.close();
      }
    };
  }, [status, dispatch]);

  useEffect(() => {
    if (connId && socket && session?.user.id) {
      socket.send(
        JSON.stringify({
          type: "wallet",
          payload: { id: session?.user.id, connectionId: connId },
        })
      );

      setInterval(() => {
        socket.send(
          JSON.stringify({
            type: "wallet",
            payload: { id: session?.user.id, connectionId: connId },
          })
        );
      }, 5000);
    }
  }, [connId, socket, session?.user.id]);

  return (
    <div className="relative md:text-xs text-[10px] flex items-center text-white bg-cardBG/10 sm:px-14 px-3 py-1 sm:rounded-full rounded-md whitespace-nowrap">
      <div className="pr-2"> Balance: {balance.balance}</div>
      <div className="sm:h-4 h-2 sm:w-px w-[0.5px] bg-white rounded-xl" />
      <Link href={"/bonus/casinobonus"} className="pl-2">
        Exposure: {balance.exposure}
      </Link>{" "}
      <div className="inset-x-0 h-px bottom-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent absolute" />
    </div>
  );
}
