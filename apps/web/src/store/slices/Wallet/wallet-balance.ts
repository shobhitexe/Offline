import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = { balance: 0, exposure: 0 };

export const walletBalanceSlice = createSlice({
  name: "walletbalance",
  initialState,
  reducers: {
    setWalletBalance: (
      state,
      action: PayloadAction<{ balance: number; exposure: number }>
    ) => {
      return {
        balance: Number(action.payload.balance.toFixed(2)),
        exposure: Number(action.payload.exposure.toFixed(2)),
      };
    },
  },
});

export const { setWalletBalance } = walletBalanceSlice.actions;

export default walletBalanceSlice.reducer;
