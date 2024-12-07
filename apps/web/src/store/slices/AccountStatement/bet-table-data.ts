import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { BetTableDataType } from "@repo/types";

const initialState: BetTableDataType[] = [];

export const BetTableDataSlice = createSlice({
  name: "bet-table-data",
  initialState,
  reducers: {
    setBetTableData: (state, action: PayloadAction<BetTableDataType[]>) => {
      return action.payload;
    },
  },
});

export const { setBetTableData } = BetTableDataSlice.actions;

export default BetTableDataSlice.reducer;
