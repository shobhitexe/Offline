import { combineReducers } from "@reduxjs/toolkit";
import DepositMethod from "./slices/Wallet/deposit-method";
import DepositBalance from "./slices/Wallet/deposit-balance";
import withdrawalMethod from "./slices/Wallet/withdrawal-method";
import sidebarOpen from "./slices/Sidebar/sidebar-open";
import statementParams from "./slices/AccountStatement/statement-params";
import betTableData from "./slices/AccountStatement/bet-table-data";
import walletBalance from "./slices/Wallet/wallet-balance";
import walletTableData from "./slices/AccountStatement/wallet-table-data";
import filterCasinoGames from "./slices/FilterCasinoGames/filter-casino-games";
import casinoGamesSlice from "./slices/CasinoGames/casino-games-slice";
import colorBetTabledata from "./slices/AccountStatement/colorbet-table-data";

const rootReducer = combineReducers({
  DepositMethod,
  DepositBalance,
  withdrawalMethod,
  sidebarOpen,
  statementParams,
  betTableData,
  walletBalance,
  walletTableData,
  filterCasinoGames,
  casinoGamesSlice,
  colorBetTabledata,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
