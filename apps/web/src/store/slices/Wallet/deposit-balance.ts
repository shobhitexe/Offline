import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getInitialBalance = () => {
  if (typeof window !== "undefined") {
    const savedBalance = localStorage.getItem("depositBalance");
    return savedBalance ? Number(savedBalance) : 500;
  }
  return 0;
};

const initialState = getInitialBalance();

const depositBalanceSlice = createSlice({
  name: "depositBalance",
  initialState,
  reducers: {
    setDepositBalance(state, action: PayloadAction<number>) {
      const newBalance = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("depositBalance", newBalance.toString());
      }
      return newBalance;
    },
  },
});

export const { setDepositBalance } = depositBalanceSlice.actions;
export default depositBalanceSlice.reducer;
