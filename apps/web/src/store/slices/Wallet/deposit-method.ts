import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = 0;

export const depositMethodSlice = createSlice({
  name: "depositmethod",
  initialState,
  reducers: {
    setDepositMethod: (state, action: PayloadAction<number>) => {
      return action.payload;
    },
  },
});

export const { setDepositMethod } = depositMethodSlice.actions;

export default depositMethodSlice.reducer;
