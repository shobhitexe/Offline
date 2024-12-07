import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type filterType = {
  provider: string;
  category: string;
};

const initialState: filterType = {
  provider: "TOP GAMES",
  category: "TOP GAMES",
};

export const filterCasinoGamesSlice = createSlice({
  name: "filtercasinogames",
  initialState,
  reducers: {
    setCasinoFilter: (state, action: PayloadAction<filterType>) => {
      return action.payload;
    },
  },
});

export const { setCasinoFilter } = filterCasinoGamesSlice.actions;

export default filterCasinoGamesSlice.reducer;
