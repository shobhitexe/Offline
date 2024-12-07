import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { WalletDataType } from "@repo/types";

const initialState: WalletDataType[] = [];

export const WalletTableDataSlice = createSlice({
  name: "wallet-table-data",
  initialState,
  reducers: {
    setWalletTableData: (state, action: PayloadAction<WalletDataType[]>) => {
      return action.payload;
    },
  },
});

export const { setWalletTableData } = WalletTableDataSlice.actions;

export default WalletTableDataSlice.reducer;
