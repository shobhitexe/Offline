"use client";

import { RootState } from "@/store/root-reducer";
import { setWalletBalance } from "@/store/slices/Wallet/wallet-balance";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCcw } from "lucide-react";

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
      }, 2000);
    }
  }, [connId, socket, session?.user.id]);

  return (
    <div className="flex items-center gap-2">
      <RefreshCcw
        className="w-4 h-4 hover:animate-spin cursor-pointer"
        onClick={() => {
          window.location.reload();
        }}
      />
      <div className="xs:text-xs text-xxs font-semibold">
        <div>
          {" "}
          Balance :{" "}
          <span className="text-[#00EF80] font-semibold">
            {balance.balance}
          </span>
        </div>

        <div>
          Exposure :{" "}
          <span className="text-[#FF6372] font-semibold">
            {balance.exposure}
          </span>
        </div>
      </div>
    </div>
  );
}
