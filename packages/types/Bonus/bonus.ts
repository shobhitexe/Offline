export type BonusType = {
  _id: string;
  amount: number;
  type: string;
};

export interface BonusHistoryTableType extends BonusType {
  srNo: number;
}

export interface BonusListTableType extends BonusType {
  srNo: number;
  claimed: boolean;
  createdAt: string;
  name: string;
}
