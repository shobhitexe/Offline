import { combineReducers } from "@reduxjs/toolkit";
import sidebarOpen from "./slices/Sidebar/sidebar-open";
import walletBalance from "./slices/Wallet/wallet-balance";
import filterCasinoGames from "./slices/FilterCasinoGames/filter-casino-games";
import casinoGamesSlice from "./slices/CasinoGames/casino-games-slice";

const rootReducer = combineReducers({
  sidebarOpen,
  walletBalance,
  filterCasinoGames,
  casinoGamesSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
