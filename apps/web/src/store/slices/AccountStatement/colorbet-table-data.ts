import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { ColorBetDataType } from "@repo/types";

const initialState: ColorBetDataType[] = [];

export const ColorBetTableDataSlice = createSlice({
  name: "colorbet-table-data",
  initialState,
  reducers: {
    setColorBetTableData: (
      state,
      action: PayloadAction<ColorBetDataType[]>
    ) => {
      return action.payload;
    },
  },
});

export const { setColorBetTableData } = ColorBetTableDataSlice.actions;

export default ColorBetTableDataSlice.reducer;
