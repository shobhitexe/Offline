import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type stateType = {
  type: string;
  startDate: string;
  endDate: string;
  statementType: "wallet" | "bet" | "colorbet";
};

const initialState: stateType = {
  type: "",
  startDate: "",
  endDate: "",
  statementType: "wallet",
};

export const StatementParamsSlice = createSlice({
  name: "statementparams",
  initialState,
  reducers: {
    setStatementParams: (state, action: PayloadAction<stateType>) => {
      return action.payload;
    },
  },
});

export const { setStatementParams } = StatementParamsSlice.actions;

export default StatementParamsSlice.reducer;
