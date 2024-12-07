import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = 0;

export const withdrawalMethodSlice = createSlice({
  name: "withdrawalmethod",
  initialState,
  reducers: {
    setWithdrawalMethod: (state, action: PayloadAction<number>) => {
      return action.payload;
    },
  },
});

export const { setWithdrawalMethod } = withdrawalMethodSlice.actions;

export default withdrawalMethodSlice.reducer;
