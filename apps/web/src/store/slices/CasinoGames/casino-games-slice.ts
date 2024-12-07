import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { GameType } from "@repo/types";

const initialState: GameType[] = [];

export const CasinoGamesDataSlice = createSlice({
  name: "casino-games-data",
  initialState,
  reducers: {
    setCasinoGamesData: (state, action: PayloadAction<GameType[]>) => {
      return action.payload;
    },
  },
});

export const { setCasinoGamesData } = CasinoGamesDataSlice.actions;

export default CasinoGamesDataSlice.reducer;
