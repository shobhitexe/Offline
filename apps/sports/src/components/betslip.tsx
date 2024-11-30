"use client";

import {
  Button,
  Card,
  CardContent,
  Input,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui";
import React, { useState } from "react";

import { X } from "lucide-react";

export default function Betslip() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBets, setSelectedBets] = useState<
    Array<{ match: string; bet: string; odds: number }>
  >([]);

  const addBet = (match: string, bet: string, odds: number) => {
    setSelectedBets([...selectedBets, { match, bet, odds }]);
  };

  const removeBet = (index: number) => {
    setSelectedBets(selectedBets.filter((_, i) => i !== index));
  };

  const calculateTotalOdds = () => {
    return selectedBets.reduce((total, bet) => total * bet.odds, 1).toFixed(2);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default">
          {/* <Receipt className="mr-2 h-4 w-4" /> */}
          Betslip ({selectedBets.length})
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Betslip</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-200px)] mt-4">
          {selectedBets.map((bet, index) => (
            <Card key={index} className="mb-2">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{bet.match}</p>
                    <p className="text-sm text-gray-500">
                      {bet.bet} @ {bet.odds}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBet(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Odds:</span>
            <div>{calculateTotalOdds()}</div>
            {/* <Badge variant="secondary">{calculateTotalOdds()}</Badge> */}
          </div>
          <Input type="number" placeholder="Stake" />
          <div className="flex justify-between items-center">
            <span className="font-medium">Potential Winnings:</span>
            <span className="font-bold text-green-600">$0.00</span>
          </div>
          <Button className="w-full">Place Bet</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
