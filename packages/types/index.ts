import { UserType, AdminType } from "./auth/User";

import {
  WalletDetails,
  InputWalletDetailsType,
  RequestWithdrawalType,
} from "./Wallet/Wallet";

import { AdminWallet } from "./Wallet/AdminWallet";

import { BetTableDataType, WalletDataType } from "./Statement/Statement";

import {
  BonusType,
  BonusHistoryTableType,
  BonusListTableType,
} from "./Bonus/bonus";

import { BulkBonusType } from "./Bonus/BulkBonus";

import { AdminSettings, BannerType } from "./Admin/AdminSettings";
import { RolesType } from "./Roles";

import { GameType } from "./Games/game";

import { gameSessionType } from "./Games/game";

import { ColorBetDataType } from "./Statement/Statement";

import {
  BetHistoryPerGame,
  GroupedBetHistoryPerGame,
  Fancy,
  SportsSettings,
  TournamentSettings,
} from "./Sports";

export type {
  UserType,
  GameType,
  AdminType,
  WalletDetails,
  InputWalletDetailsType,
  RequestWithdrawalType,
  BetTableDataType,
  WalletDataType,
  BonusType,
  BonusHistoryTableType,
  AdminWallet,
  BulkBonusType,
  BonusListTableType,
  AdminSettings,
  RolesType,
  BannerType,
  gameSessionType,
  ColorBetDataType,
  BetHistoryPerGame,
  GroupedBetHistoryPerGame,
  Fancy,
  SportsSettings,
  TournamentSettings,
};
