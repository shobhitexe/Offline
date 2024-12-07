import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const sidebarOpenSlice = createSlice({
  name: "sidebaropen",
  initialState,
  reducers: {
    setSideBarOpen: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export const { setSideBarOpen } = sidebarOpenSlice.actions;

export default sidebarOpenSlice.reducer;
