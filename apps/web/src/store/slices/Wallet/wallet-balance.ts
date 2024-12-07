import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = { cash: 0, bonus: 0 };

export const walletBalanceSlice = createSlice({
  name: "walletbalance",
  initialState,
  reducers: {
    setWalletBalance: (
      state,
      action: PayloadAction<{ cash: number; bonus: number }>
    ) => {
      return {
        cash: Number(action.payload.cash.toFixed(2)),
        bonus: Number(action.payload.bonus.toFixed(2)),
      };
    },
  },
});

export const { setWalletBalance } = walletBalanceSlice.actions;

export default walletBalanceSlice.reducer;
