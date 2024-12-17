import { options } from "@/app/api/auth/[...nextauth]/options";
import { BackendURL, staticServerURL } from "@/config/env";
import { gameSessionType } from "@repo/types";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import GameWindow from "./gameWindow";

type betlimitType = {
  minBet: number;
  maxBet: number;
  maxWin: number;
};

async function getBalance(id: string) {
  try {
    const response = await fetch(`${BackendURL}/api/wallet/balance?id=${id}`);

    if (!response.ok) {
      return undefined;
    }

    const res = await response.json();

    return res.data.cashBalance;
  } catch (error) {
    return null;
  }
}

async function getGameData(providerName: string, gameId: string) {
  const header = headers();
  const agent = header.get("user-agent");
  const isDesktop = agent?.includes("Windows");
  const session = await getServerSession(options);

  const balance = await getBalance(session?.user.id!);

  const data = {
    providerName,
    gameId,
    // userId: session?.user.uniqueCode,
    username: session?.user.name,
    platformId: isDesktop ? "desktop" : "mobile",
    lobby: true,
    clientIp: header.get("x-forwarded-for"),
    currency: "INR",
    balance: balance,
    operatorId: process.env.OPERATOR_ID,
    redirectUrl: process.env.NEXTAUTH_URL,
  };

  try {
    const response = await fetch(`${staticServerURL}/api/static/game/login`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return undefined;
    }

    const res = await response.json();

    return res.data;
  } catch (error) {
    return undefined;
  }
}

async function fetchGameLmits(id: string) {
  try {
    const response = await fetch(
      `${BackendURL}/api/home/casino/game/betlimit?id=${id}`,
      {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }
    );

    if (!response.ok) {
      return undefined;
    }

    const res = await response.json();

    return res.data;
  } catch (error) {
    return undefined;
  }
}

export default async function page({ params }: { params: { data: string[] } }) {
  const gameSession: gameSessionType = await getGameData(
    params.data[0],
    params.data[1]
  );

  const gameLmits: betlimitType = await fetchGameLmits(params.data[1]);

  if (gameSession === undefined || gameLmits === undefined) {
    return <div className="min-h-screen" />;
  }

  return (
    <GameWindow
      frameSrc={gameSession.url}
      minBet={gameLmits.minBet}
      maxBet={gameLmits.maxBet}
      maxWin={gameLmits.maxWin}
    />
  );
}
